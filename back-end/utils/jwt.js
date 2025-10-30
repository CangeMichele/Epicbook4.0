import jwt from "jsonwebtoken";

//creazione nuovo token autenticazione
export const generateJWT = (playload) => {
    return new Promise((resolve, reject) =>
        jwt.sign(
            playload,
            process.env.JWT_SECRET,
            { expiresIn: "1 day" }, // scadenza login
            (err, token) => {
                if (err) reject(err);
                else resolve(token);
            }
        )
    );
};

// verifica token autenticazione
export const verifyJWT = (token) => {
    return new Promise((resolve, reject) =>
        jwt.verify(
            token, 
            process.env.JWT_SECRET,
            (err, decoded) =>{
                if (err) reject(err);
                else resolve(decoded);
            }
        )
    );

}