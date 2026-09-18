export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        ok: false,
        error: {
            code: "NOT_FOUND",
            reason: "not_found_handler",
            message: "Percorso non trovato"
        },
    })
};

export const genericErrorHandler = (err, req, res, next) => {
    console.error(err.stack || err); //restituisce percorso tracciamento errore
    res.status(500).json({
        ok: false,
        error: {
            code: "SERVER_ERROR",
            reason: "internal_server_error",
            message: "Errore server"
        },
    })
};