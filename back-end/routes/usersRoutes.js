import express from "express";
import User from "../models/User.js";
import multer from "multer";

import { replaceCloudinaryImage, cloudinary } from "../config/cloudinaryConfig.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
// ---- services
import { createUser } from "../services/action/user/createUser.js";
import { createAvatar } from "../services/action/user/createAvatar.js";
import { getUser } from "../services/action/user/getUser.js";
import { updateUser } from "../services/action/user/updateUser.js";
import { deleteUser } from "../services/action/user/deleteUser.js";
//----- utils
import errorStatusMap from "../utils/errorStatusMap.js";

const router = express.Router();

// multer in RAM
const upload = multer({ storage: multer.memoryStorage() });


// --------------------------   POST   -----------------------------------
//#region POST

// -> creazione nuovo utente
router.post("/", upload.single("avatar"), async (req, res) => {

    //strutturazione dati password     
    const { password0, password1, ...rest } = req.body;
    const userData = {
        ...rest,
        passwordList: { newPasswords: [password0, password1] },
    };

    const file = req.file;

    //carimento file su cloudinary
    //NB: fuori dal try/catch perchè qualuncque risposta non è bloccante
    const resultAvatar = await createAvatar(file);
    const avatarData = resultAvatar.data;

    try {
        //elaborazione dati e salvataggio in DB
        const resultUser = await createUser({ ...userData, ...avatarData });

        //se fallisce caricamento user, elimino avatar su cloudinary se diverdo da default
        if (!resultUser.ok) {

            if (avatarData.avatar_id !== "epicbook/avatar/avt_default") {
                const deleteAvatar = await cloudinary.uploader.destroy(
                    avatarData.avatar_id,
                    { resource_type: "image" }
                );
                if (deleteAvatar.result !== "ok") {
                    console.error("Impossibile eliminare risorsa: ", deleteAvatar, avatarData)
                }
            }
            //restituisci errore
            const status = errorStatusMap[resultUser.error.code] || 500;
            return res.status(status).json(resultUser);
        }

        return res.status(201).json(resultUser);

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
    const _id = req.user._id.toString();
    //estrapolazione dati dal body     
    const { password0, password1, oldPassword, ...rest } = req.body;
    //indicatore presenza campi password 
    const isEditPassword = Boolean(oldPassword || password0 || password1);

    //costruzione dati
    const dataEdit = {
        _id,
        ...rest,
        ...(isEditPassword ? {
            passwordList: {
                newPasswords: [password0, password1],
                oldPassword
            }
        } : {})
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

//-> Cancella utente 
router.delete("/me", authMiddleware, async (req, res) => {
    //recupero dati 
    const _id = req.user._id.toString();
    const password = req.body.password;

    const inputDelete = { _id, password }

    try {
        const result = await deleteUser(inputDelete);

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
                reason: "delete_user",
                message: error.message
            }
        });
    }

});



//#endregion 

export default router;
