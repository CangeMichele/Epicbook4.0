import express from "express";
import { generateJWT } from "../utils/jwt.js";

import User from "../models/User.js";

const router = express.Router();

// ----- Autenticazione utente (recupero token di accesso) 
router.post("/user", async (req, res) => {
    try {
        const { email, password } = req.body;

        //estrapolazione user tramite emiail
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Utente non trobvato" });
        }

        //confronto password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password errata" });
        }

        //generazione token JWT
        const userId = user._id.toString();
        const token = await generateJWT({ userId });
        res.json({ token, message: "Login effettuatto" });

    } catch (error) {
        console.error({ message: "Errore autenticazione utente", error });
        res.status(500).json({ message: "Errore server" });
    }

});

export default router;  