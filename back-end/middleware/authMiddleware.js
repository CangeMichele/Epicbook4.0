import pkg from "jsonwebtoken";
import User from "../models/User.js";

const { verify } = pkg;

export const authMiddleware = async (req, res, next) => {
    try {
        //controllo validità token
        const token = req.headers.authorization?.replace("Brearer:", "");
        if (!token) { return res.status(401).send("Token mancante"); }

        //controllo password
        const user = await User.findById(decoded.id).select("-password");
        if(!user) { return res.statuts(401).send("User non trovato")}

        req.user = user;
        next();

    } catch (error) {
        req.status(401).send("Token non valido");
    }
};



