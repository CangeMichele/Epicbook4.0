// *** CONTROLLI VALIDITA' DATI RECENSIONE + PULIZIA DATI ***

//--> Controllo campo ASIN
function validateAsin(asin) {
    if (!asin) {
        return {
            status: false,
            details: "asin_error",
            message: "Parametro asin assente."
        };
    }
    //sanitizzazione dati
    const sanitized = asin.trim().toUpperCase();

    //se non si è bloccato prima, dato valido
    return { status: true, value: sanitized };
};

//--> Controllo campo User_id
function validateUser_id(user_id) {
    if (!user_id) {
        return {
            status: false,
            details: "userId_error",
            message: "Parametro user_id assente."
        };
    }
    //sanitizzazione dati
    const sanitized = user_id.trim()

    //se non si è bloccato prima, dato valido
    return { status: true, value: sanitized };
};

//--> Controllo campo commento
function validateComment(comment) {
    if (!comment) {
        return {
            status: false,
            details: "comment_error",
            message: "Parametro comment assente."
        };
    }

    if (typeof comment !== "string") {
        return {
            status: false,
            details: "comment_isnot_string",
            message: "Parametro comment non è una stringa."
        };
    }

    //sanitizzazione dati
    let sanitized = comment.trim();

    if (sanitized.length > 500) {
        return {
            status: true,
            warning: true,
            value: sanitized.slice(0, 498) + "...",
            details: "comment_too_long",
            message: "Commento troppo lungo. Testo tagliato"
        };
    }

    //se non si è bloccato prima, dato valido
    return {
        status: true,
        warning: false,
        value: sanitized
    };
};

//--> Controllo campo rating
function validateRating(rating) {
    let numericRating = rating;

    if (rating === undefined || rating === null) {
        return {
            status: false,
            details: "rating_error",
            message: "Parametro rating non presente."
        }
    }

    //se numero controllo se nel range
    if (typeof rating == "number") {
        if (rating < 1 || rating > 5) {
            return {
                status: false,
                details: "rating_error",
                message: "Parametro rating fuori dal range."
            }
        }
    } else if (typeof rating == "string") {
        
        //se è stringa lo converto in numero
        numericRating = Number(rating);
        
        //errore se conversione non restituisce numero
        if (Number.isNaN(numericRating)) {
            return {
                status: false,
                details: "rating_error",
                message: "Parametro rating non è un numero."
            }

        }
    } else {
        //errore se non è numerico e se non è stringa convertibilie
        return {
            status: false,
            details: "rating_error",
            message: "Parametro rating non valido."
        }
    }

    //se non si è bloccato prima, dato valido
    return { status: true, value: numericRating };
};


export const reviewValidators = {
    asin: validateAsin,
    user_id: validateUser_id,
    comment: validateComment,
    rating: validateRating
};

