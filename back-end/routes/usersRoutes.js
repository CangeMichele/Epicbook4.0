import express from "express";
import User from "../models/User.js";
import multer from "multer";

import { generateJWT } from "../utils/jwt.js";
import { replaceCloudinaryImage, cloudinary } from "../config/cloudinaryConfig.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// multer in RAM
const upload = multer({ storage: multer.memoryStorage() });

// --------------------------   POST   -----------------------------------
//#region POST


// -> creazione nuovo utente
router.post("/", async (req, res) => {
    try {
        const user = new User(req.body);
        const newUser = await user.save();

        //rimozine password dalla risposta (sicurezza)
        const response = newUser.toObject();
        delete response.password;

        //crezione e assegnazione token per login automatico
        const token = await generateJWT({ id: user._id });
        response.token = token;

        res.status(201).json(response);

    } catch (error) {
        res.status(500).json({ message: "errore api" + error.message });
    }
})

// -> salvataggio file img avatar su cloudnary
router.post("/avatar", upload.single("avatar"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" });
    }

    try {
        const result = await replaceCloudinaryImage({
            buffer: req.file.buffer,
        });
        res.status(200).json({
            avatar_url: result.secure_url,
            avatar_id: result.public_id,
        });

    } catch (error) {
        res.status(500).json({ message: "Errore upload avatar" });
    }
});

//#endregion

// --------------------------   GET   --------------------------------------
//#region GET

// -> Utenti con parametri
router.get("/", async (req, res) => {
    try {

        // lista di parametri consentiti
        const allowedParams = ["userName", "email", "prefix"];

        //filtra paramentri consentiti (se vuoto res = tutti gli utenti)
        const params = Object.fromEntries(
            Object.entries(req.query).filter(
                ([key]) => allowedParams.includes(key)
            )
        );

        // lista di parametri univoci (solo uno fra questi)
        const uniqueParams = ["userName", "email", "prefix"];
        //controllo presenza parametri univoci
        const presentKeys = uniqueParams.filter(key => key in params);
        if (presentKeys.length > 1) throw new Error("Errore nei parametri univoci");

        //rendo insensitive tutti i parametri di ricerca
        Object.keys(params).forEach((key) => {
            if (typeof params[key] === "string") {

                if (key === "prefix") {
                    //se ricerco prefisso popolo username ( regex senza $, match parziale insensitive)
                    params.userName = { $regex: `^${params[key]}`, $options: "i" };
                    delete params.prefix;
                } else {
                    //altrimenti regola per tutti (match preciso insensitive)
                    params[key] = { $regex: `^${params[key]}$`, $options: "i" };
                }
            }
        });

        //chiamata al DB
        const users = await User.find(params);
        res.json(users);

    } catch (error) {
        res.status(404).json({ message: error.message })
    }



});

// -> Dati sensibli tramite authMiddleware
router.get("/me", authMiddleware, async (req, res) => {
    //recupero dati utente elaborati dal middleware
    const userData = req.user.toObject();
    const user_id = userData;

    //recupero user tramite id
    const user = await User.findById(user_id);
    if (!user) {
        return res.json({ message: "Utente non trovato" });
    };


    // ----> CORRISPONDENZA PASSWORD
    const passwordToControl = req.query.password;

    const isMatch = await user.comparePassword(passwordToControl);
    if (isMatch) {
        return res.json({ status: true, message: "Corrispondenza password" });
    } else {
        return res.json({ status: false, message: "Nessuna corrispondenza password" });
    }

}
);

//#endregion

// --------------------------   PUT   -------------------------------------
//#region PUT

// -> AVATAR: sovrascrittura immagine avatar (stesso id, stesso url, diversa immagine)
router.put("/me/avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
    //recupero dati utente elaborati dal middleware
    const userData = req.user.toObject();
    const user_id = userData._id;

    if (!req.file)
        return res.status(400).json({ message: "Dati insufficenti" });

    try {
        //recupero dati utente 
        const user = await User.findById(user_id).select("avatar_url avatar_id");
        if (!user) {
            return res.status(400).json({ message: "Utente non trovato" })
        }

        //aggiornamento 
        const result = await replaceCloudinaryImage({
            buffer: req.file.buffer,
            publicId: user.avatar_id === "epicbook/avatar/avt_default" ? undefined : user.avatar_id,
        });

        user.avatar_id = result.public_id;
        user.avatar_url = result.secure_url;

        // salvo aggiornamenti
        await user.save();

        res.status(200).json({
            avatar_id: result.public_id,
            avatar_url: result.secure_url
        });

    } catch (error) {
        res.status(500).json({ message: "Errore upload avatar" });
    }
});


// -> USER
router.put("/me", authMiddleware, async (req, res) => {

    //recupero id dal middleware
    const user_id = req.user._id.toString();
    // recupero i dati modificati
    const editData = req.body;

    try {
        //non uso findByIdAndUpdate perchè non applica i middleware .pre("save)

        //recupero user
        const user = await User.findById(user_id);

        //verifico parametri cambiati
        for (const [filed, value] of Object.entries(editData)) {

            if (user[filed] !== value && value) {
                user[filed] = value;
            }
        };

        const updateUser = await user.save();

        const response = updateUser.toObject();
        delete response.password;

        res.status(200).json(response);
        
    } catch (error) {
        res.status(500).json({ message: "Errore upload user" });
    }
})

//#endregion

// --------------------------   DELETE   --------------------------------------
//#region DELETE


// -> Cancella Avatar da coludinary
// router.delete("/:user_id/avatar/:avatar_id", authMiddleware, async (req, res) => {
router.delete("/:user_id/avatar/:avatar_id", async (req, res) => {
    const { user_id, avatar_id } = req.params;

    //verifico che user_id sia uguale a id loggato
    if (req.user._id.toString() !== user_id)
        return res.status(403).json({ message: "Non autorizzato" })

    try {
        if (!avatar_id) {
            return res.status(400).json("Errore eliminazione avatar, nessun id presente");
        }

        if (avatar_id !== "avt_default") {
            const deleteAvatar = await cloudinary.uploader.destroy(avatar_id, { resource_type: "image" });

            if (deleteAvatar.result === "not found") return res.status(404).json({ message: "Avatar non trovato" })
            return res.status(200).json({ message: "Avatar eliminato" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Errore nella cancellazione su cloudinary - " + error })
    }
});


// -> cancella utente da id
// router.delete("/:user_id", authMiddleware, async (req, res) => {
router.delete("/:user_id", async (req, res) => {
    const idToDelete = req.params.user_id;

    // //verifico che user_id sia uguale a id loggato(che è dentro authMidlleware)
    // if (req.user._id.toString() !== idToDelete)
    //     return res.status(403).json({ message: "Non autorizzato" })

    try {
        //recupero id avatar
        const avatarToDelete = await User.findById(idToDelete, { "avatar_id": 1 });

        //elimino avatar
        const resAvatarDelete = await cloudinary.uploader.destroy(avatarToDelete.avatar_id, { resource_type: "image" });
        if (resAvatarDelete.result !== "ok") {
            console.log("resAvrt:", JSON.stringify(resAvatarDelete, null, 2));

            throw new Error("Errore cancellazione su cloudinary");
        }

        //elimino utente dal
        const resUserDelete = await User.findByIdAndDelete(idToDelete);
        if (!resUserDelete) return res.status(404).json({ message: "utente non trovato" });
        return res.status(200).json({ message: "utente eliminato con successo" });

    } catch (error) {
        res.status(500).json({ message: "errore server: " + error });
    }
});



//#endregion 

export default router;
