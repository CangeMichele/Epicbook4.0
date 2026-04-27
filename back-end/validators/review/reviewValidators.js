// *** CONTROLLI VALIDITA' DATI RECENSIONE + PULIZIA DATI ***

// --------------------------   TYPE   --------------------------------------
//--> Validatore di stringhe 
function stringValidator(value, fieldName, { transforms } = {}) {
    //controllo presenza valore
    if (value == null) {
        return {
            reason: "empty",
            message: `Parametro ${fieldName} assente.`,
            details: { field: fieldName }
        };
    }

    //controllo tipologia dato
    if (typeof value !== "string") {
        return {
            reason: "invalid_type",
            message: `Parametro ${fieldName} non valido.`,
            details: { field: fieldName, value }
        };
    }

    //normalizzazione dati
    let sanitized = value.trim();

    //nuovo controllo presenza valore
    if (sanitized === "") {
        return {
            reason: "empty",
            message: `Parametro ${fieldName} vuoto.`,
            details: { field: fieldName }
        };
    }

    //esegue istruzioni se presenti in array di trasformazione
    if (Array.isArray(transforms) && transforms.length > 0) {
        //cicla transforms e aggiorna valore secondo la funzione inserita
        for (const fn of transforms) {
            sanitized = fn(sanitized);
        }
    }

    //restituisco stringa controllata e pulita
    return { value: sanitized };
}


//--> Validatore numerico intero
function integerNumberValidator(value, fieldName) {

    //controllo presenza valore
    if (value == null) {
        return {
            reason: "empty",
            message: `Parametro ${fieldName} assente.`,
            details: { field: fieldName }
        };
    }

    //accetto solo numeri interi o stringhe (per tentativo conversione)
    if (typeof value !== "string" && typeof value !== "number") {
        return {
            reason: "invalid_type",
            message: `Parametro ${fieldName} non valido.`,
            details: { field: fieldName, value }
        };
    }

    let numericValue = value;

    //se stringa
    if (typeof value === "string") {
        const trimmed = value.trim();

        //controllo prensenza valore
        if (trimmed === "") {
            return {
                reason: "empty",
                message: `Parametro ${fieldName} vuoto.`,
                details: { field: fieldName }
            };
        }

        //coversione stringa
        numericValue = Number(trimmed);
    }

    //controllo se numero
    if (Number.isNaN(numericValue)) {
        return {
            reason: "invalid_number",
            message: `Parametro ${fieldName} non è un numero.`,
            details: { field: fieldName, value }
        };
    }

    //controllo se numero intero
    if (!Number.isInteger(numericValue)) {
        return {
            reason: "invalid_integer",
            message: `Parametro ${fieldName} non è un numero intero.`,
            details: { field: fieldName, value }
        };
    }

    //restituisco numero valido
    return { value: numericValue };
}

// --------------------------   FIELD   --------------------------------------

//--> Controllo campo user_id
function validateUser_id(user_id) {

    const istructions = [(v) => v.toLowerCase()];

    //verifico input
    const result = stringValidator(
        user_id,
        "user_id",
        { transforms: istructions }
    )

    return result;
};

//--> Controllo campo ASIN
function validateAsin(asin) {

    const istructions = [(v) => v.toUpperCase()];

    //verifico input
    const result = stringValidator(
        asin,
        "asin",
        { transforms: istructions }
    )

    return result;
};

//--> Controllo campo rating
function validateRating(rating) {
    //verifico input
    const result = integerNumberValidator(rating, "rating");

    if (!("value" in result)) return result

    const numericRating = result.value;

    //controllo se numero fuori range
    if (numericRating < 1 || numericRating > 5) {
        return {
            reason: "out_of_range",
            message: "Parametro rating fuori dal range.",
            details: { field: "rating", value: rating }
        }
    }

    return result
};

//--> Controllo campo commento
function validateComment(comment) {

    let istructions = [];
    let warning = null;

    if (typeof comment === "string" && comment.trim().length > 500) {
        //essegui taglio
        istructions = [
            (v) => v.slice(0, 497),
            (v) => v + "..."
        ];
        //popola warning
        warning = {
            reason: "text_too_long",
            message: "Commento troppo lungo. Testo tagliato",
            details: {
                field: "comment",
                originalLength: comment.length,
                maxLength: 500
            }
        }
    }

    //verifico input
    const result = stringValidator(comment, "comment", { transforms: istructions });

    if (!("value" in result)) return result;

    return { ...result, ...(warning && { warning }) };

};

//--> Controllo campo Review_id
function validateReview_id(review_id) {

    const istructions = [(v) => v.toLowerCase()];

    //verifico input
    const result = stringValidator(
        review_id,
        "review_id",
        { transforms: istructions }
    )

    return result;
};

// --------------------------   EXPORT WRAPPER   --------------------------------------

export const reviewValidators = {
    user_id: validateUser_id,
    asin: validateAsin,
    rating: validateRating,
    comment: validateComment,
    review_id: validateReview_id
};

