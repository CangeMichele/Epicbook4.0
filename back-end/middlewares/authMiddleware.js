import { verifyJWT } from "../utils/jwt.js";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        // estrapolazione token 
        const token = req.headers.authorization?.replace("Bearer ", "");
        
        //controllo presenza token
        if (!token) { return res.status(401).send("Token mancante"); }

        //decodifica token
        const decoded = await verifyJWT(token);

        //verifica utente cercandolo tramite id decodificato
        const user = await User.findById(decoded.id).select("-password");
        
        //controllo presenza user
        if(!user) { return res.status(401).send("User non trovato")}

        //restituzione dati user
        req.user = user;

        //passo alla prossimo middleware
        next();

    } catch (error) {
        res.status(401).send("Token non valido");
    }
};



