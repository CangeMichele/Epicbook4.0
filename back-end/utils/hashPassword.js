// hashPassword.js
import bcrypt from "bcrypt";


async function hashPassword(plainPassword) {
    try {
        const salt = await bcrypt.genSalt(10);        // genera il salt
        const hashed = await bcrypt.hash(plainPassword, salt); // calcola l'hash
        console.log("Password in chiaro:", plainPassword);
        console.log("Password hashata:", hashed);
        return hashed;
    } catch (error) {
        console.error("Errore hashing password:", error);
    }
}

// Qui metti la password da hashare
const passwordDaHashare = "Ciaobelli1!";

// Esegui la funzione
hashPassword(passwordDaHashare);