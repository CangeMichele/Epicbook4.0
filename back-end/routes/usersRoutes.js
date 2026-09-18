import express from "express";
import User from "../models/User.js";
import multer from "multer";

import { generateJWT } from "../utils/jwt.js";
import { replaceCloudinaryImage, cloudinary } from "../config/cloudinaryConfig.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
// ---- services
import { createUser } from "../services/user/action/createUser.js";
import { getUser } from "../services/user/action/getUser.js";
import { updateUser } from "../services/user/action/updateUser.js";
//----- utils
import errorStatusMap from "../utils/errorStatusMap.js";

const router = express.Router();

// multer in RAM
const upload = multer({ storage: multer.memoryStorage() });


// --------------------------   POST   -----------------------------------
//#region POST

// -> creazione nuovo utente
router.post("/", upload.single("avatar"), async (req, res) => {

    let avatar_url = "https://res.cloudinary.com/dvbmskxg4/image/upload/v1772792679/epicbook/avatar/avt_default.png";
    let avatar_id = "epicbook/avatar/avt_default";

    try {
        //strutturazione dati password     
        const { password0, password1, ...rest } = req.body;
        const userData = {
            ...rest,
            passwordList: { newPasswords: [password0, password1] },
        };


        let avatarData = null;

        //caricamento avatar se file presente
        if (req.file) {

            const uploaded = await replaceCloudinaryImage({
                buffer: req.file.buffer,
            });

            if (!uploaded) {
                return res.status(400).json({ message: "Salvataggio fallito. Errore upload avatar" });
            }

            avatarData = {
                avatar_url: uploaded.secure_url,
                avatar_id: uploaded.public_id,
            };
        }

        //elaborazioen dati e salvataggio in DB
        const result = await createUser({ ...userData, ...avatarData });

        if (!result.ok) {
            //eliminazione avatar appena caricato
            if (avatarData?.avatar_id && avatarData.avatar_id !== "avt_default") {
                const deleteAvatar = await cloudinary.uploader.destroy(
                    avatarData.avatar_id,
                    { resource_type: "image" }
                );
            }
            //restituisci errore
            const status = errorStatusMap[result.error.code] || 500;
            return res.status(status).json(result);
        }

        return res.status(201).json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "user_query_server",
                message: error.message
            }
        });
    }
});

//#endregion

// --------------------------   GET   --------------------------------------
//#region GET

// -> ricerca utenti per parametri
router.get("/", async (req, res) => {

    try {
        const result = await getUser(req.query);
        if (!result.ok) {
            const status = errorStatusMap[result.error.code] || 500;
            return res.status(status).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "user_query_server",
                message: error.message
            }
        });
    }

});

// -> confronto password
router.get("/me/check-password", authMiddleware, async (req, res) => {

    const { password } = req.body;

    if (!password)
        return res.status(400).json({
            status: false,
            messagge: "Nessuna password inserita."
        });

    const isMatch = await req.user.comparatePassword(password);

    return res.json({
        status: isMatch
    });
});

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
    const dataEdit = req.body;
    //estrapolazione dati password     
    const { password0, password1,oldPassword, ...rest } = req.body;

    dataEdit = {
        ...rest,
        _id: user_id,
        passwordList: {
            newPasswords: [password0, password1],
            oldPassword
        }
    };

    try {
        //elaborazione dati e salvataggio in DB
        const response = await updateUser(dataEdit);

        if (!response.ok) {
            const status = errorStatusMap[response.error.code] || 500;
            return res.status(status).json(response);
        }
        res.status(200).json(response);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            error: {
                code: "SERVER_ERROR",
                reason: "user_query_server",
                message: error.message
            }
        });
    }
});

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
