import express from "express";
import User from "../models/User.js";


import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { cloudinary, cloudinaryUploader } from "../config/cloudinaryConfig.js"

const router = express.Router();

// --------------------------   POST   --------------------------------------
//#region POST

// -> salvataggio file img avatar su cloudnary
router.post("/", cloudinaryUploader.single("avatar"), async (req, res) => {
    try {
        const formData = req.body;

        if (req.file) {
            //carico file cover
            formData.avatar_url = req.file.path;
            formData.avatar_id = req.file.filename;
        }

        const newUser = new User(formData);
        await newUser.save();
        res.status(201).json(newUser);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// -> creazione nuovo utente
router.post("/new", async (req, res) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();

        //rimozine password dalla risposta (sicurezza)
        const response = newUser.toObject();
        delete response.password;

        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// -> login con assegnazione token autenticazione
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return req.statusCode(401).json({ message: "Email non valida" });
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

// --------------------------   GET   --------------------------------------
//#region GET

// -> tutti gli utenti
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// -> utente da email
router.get("/email/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (user) {
            res.json({ exist: true })
        } else {
            res.json({ exist: false })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// -> lista username con stesso prefisso (es. mario, mario3, mariorossi)
router.get("/usernamePrefix/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const userList = await User.find({
            userName: {
                $regex: `^${username}`,
                $options: "i"
            }
        }).select("userName");
        console.log(userList);

        res.status(200).json(userList);


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// -> Estrapolazione dati utente tramite token autenticazione
router.get("/me", authMiddleware, (req, res) => {
    const userData = req.user.toObject();
    delete userData.password;
    res.json(userData);
});

//#endregion

// --------------------------   DELETE   --------------------------------------
//#region DELETE

// -> cancella utente da email
router.delete("/:email", async (req, res) => {

    const user = await User.findOne({ email: req.params.email });
    if (!user) {
        return res.status(404).json({ message: "utente non trovato" })
    }

    //eliminazione avatar su cloudinary
    const avatar_id = user.avatar_id;
    if (avatar_id && avatar_id !== "default_avatar_pac2qu") {
        try {
            await cloudinary.uploader.destroy(avatar_id, { resource_type: "image", });
        } catch (CloudinaryError) {
            return res.status(500).json({ message: "Errrore nella cancellazione cloudinary - " + CloudinaryError })
        }
    }

    //elimizazione utente
    const user_id = user._id;
    try {
        const userDelete = await User.findByIdAndDelete(user_id);
        if (!userDelete) return res.status(404).json({ message: "utente non trovato" });
        return res.status(200).json({ message: "utente eliminato con successo" });
    } catch (error) {
        res.status(500).json({ message: "errore server: " + error });
    }
});

//#endregion 

export default router;
