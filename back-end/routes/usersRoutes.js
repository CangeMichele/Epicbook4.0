import express from "express";
import User from "../models/User.js";

import { generateJWT } from "../utils/jwt.js";
import cloudinaryUploader from "../config/cloudinaryConfig.js";

const router = express.Router();

// --------------------------   POST   --------------------------------------
//#region POST

 // -> salvataggio file img avatar su cloudnary
 router.post("/user/avatar", cloudinaryUploader.single("avatar"), async(req, res)=>{
    try {
        res.status(200).json({
            avatr_url: req.file.path,
            avatr_id: req.file.filename
        });
    } catch (error) {
        res.status(500).json({message: "Errore upload avatar"});
        
    }
 })
    
// -> creazione nuovo utente
router.post("/user", async (req, res) => {
    try {
        const user = new User(req.body);
        const newUser = await user.save();

        //rimozine password dalla risposta (sicurezza)
        const response = newUser.toObject();
        delete response.password;

        //crezione e assegnazione token per login automatico
        const token = generateJWT({ id: user._id });
        response.token = token;

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

// -> tutti gli utenti
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {
        res.status(404).json({ message: error.message })
    }
});

// -> utente da userName
router.get("/user/:userName", async (req, res) => {
    try {
        const { userName } = req.params
        const user = await User.findOne({ userName });
        if (user) {
            req.status(200).json(user);
        } else {
            req.status(404).json({ message: "userName non trovato nel db" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// -> esistenza da email 
router.get("/email-exists/:email", async (req, res) => {
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
router.get("/prefix-username/:username", async (req, res) => {
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

//#endregion

// --------------------------   DELETE   --------------------------------------
//#region DELETE

// -> cancella utente da email
router.delete("/email/:email", async (req, res) => {

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
