import express from "express";
import { generateJWT } from "../utils/jwt.js";

import User from "../models/User.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ---------- Autenticazione utente (restituisce token di accesso) ----------

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //ricerca user tramite email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Utente non trobvato" });
        }

        //confronto password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password errata" });
        }

        //generazione token JWT tramite id
        const token = await generateJWT({ id:user._id });
        res.json({ token, message: "Login effettuatto" });

    } catch (error) {
        console.error({ message: "Errore nel login", error });
        res.status(500).json({ message: "Errore server" });
    }

});


// ---------- Recupero dati utente ----------
router.get("/me", authMiddleware, (req, res) =>{
    
    //recupero dati utente elaborati dal middleware
    const userData = req.user.toObject(); 
    // rimuovo password dalla risposta
    delete userData.password; 

    //restituisco dati utente
    res.json(userData);
})

export default router;  