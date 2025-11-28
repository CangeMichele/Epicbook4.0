export const badRequestHandler = (err, req, res, next) => {
    if (err.status === "400" || err.name === "ValidationError"){
        res.status(400).json({
            error: "richiesta non valida",
            message: err.message
        })
    } else {
        next(err);
    }
};

export const authorizedHandler = (err, req, res, next) =>{
    if(err.status === "401"){
        res.status(401).json({
            erorr: "Errore di autenticazione",
            message: "Effettua nuova autenticazione"
        })
    } else {
        next(err);
    }
};

export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        error: "Risorsa non trovata",
        message: "La risorsa richesta non è stata trovata"
    })
};

export const genericErrorHandler = (err, req, res, next) =>{
    console.error(err.stack); //restituisce percorso tracciamento errore
    res.status(500).json({
        error:"Internal server error",
        message:"Errore generico"
    })
};