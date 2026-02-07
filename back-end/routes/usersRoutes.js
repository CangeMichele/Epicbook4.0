import express from "express";
import User from "../models/User.js";

import { generateJWT } from "../utils/jwt.js";
import { cloudinary, cloudinaryUploader } from "../config/cloudinaryConfig.js";

const router = express.Router();

// --------------------------   POST   --------------------------------------
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
        console.log(response);


        res.status(201).json(response);

    } catch (error) {
        res.status(500).json({ message: "errore api" + error.message });
    }
})

// -> salvataggio file img avatar su cloudnary
router.post("/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
    try {
        res.status(200).json({
            avatar_url: req.file.path,
            avatar_id: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ message: "Errore upload avatar" });

    }
})

// -> login con assegnazione token autenticazione
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return req.statusCode(401).json({ message: "Utente non trovato" });
        }

        const isMatch = await User.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password errata" });
        }

        const token = await generateJWT({ id: user._id });
        res.json({ token, message: "Login ok" });

    } catch (error) {
        console.error("Errore nel login", error);
        res.status(500).json({ message: "Errore del server" });
    }
});
//#endregion

// --------------------------   PUT   -------------------------------------
//#region PUT

// -> modifica immagine profilo
router.put("/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {

    try {
        const { user_id, fileName } = req.body;

        if (req.file) {
            //upload su clloudinary 
            const uploaded = await new Promise((resolve, reject) => { //wrappo su una promise per usare await
                const stream = cloudinary.uploader.upload_stream(
                    {
                        public_id: fileName,
                        folder: "epicbook/avatar",
                        overwrite: true,
                    },
                    (err, uploaded) => { err ? reject(err) : resolve(uploaded) }
                );
                //invio del file
                stream.end(req.file.buffer);
            });
        }

        //TO DO OGGETTO DA POPOLARE CON PARAMETRI E POI AGGIORNARE USER PASSANDO L'OGGETTO

        //aggiorno utente
        const user = await User.findByIdAndUpdate(
            user_id,
            {
                avatar_url: uploaded.secure_url,
                avatr_id: uploaded.public_id
            },

        );

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
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

//#endregion

// --------------------------   DELETE   --------------------------------------
//#region DELETE


// -> Cancella Avatar da coludinary
router.delete("/avatar", async (req, res) => {
    const avatar_id = req.query.avatar_id;
    try {
        if (!avatar_id) throw new Error("Errore eliminazione avatar, nessun id presente");

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
router.delete("/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const userDelete = await User.findByIdAndDelete(_id);
        if (!userDelete) return res.status(404).json({ message: "utente non trovato" });
        return res.status(200).json({ message: "utente eliminato con successo" });

    } catch (error) {
        res.status(500).json({ message: "errore server: " + error });
    }
});



//#endregion 

export default router;
