// *** VALIDAZIONE PER CAMPI DI REVIEW ***

//--- validatori base
import {
    stringValidator,
    integerNumberValidator
} from "../baseValidator.js";

// -------------------- CAMPI DA VALIDARE --------------------

//--> Controllo campo user_id 
function validateUser_id(user_id) {
    const transforms = [];
    //verifico input
    const result = stringValidator(
        user_id,
        "user_id",
        transforms
    )
    return result;
};

//--> Controllo campo ASIN
function validateAsin(asin) {
    const transforms = [(v) => v.toUpperCase()];
    //verifico input
    const result = stringValidator(
        asin,
        "asin",
        transforms
    )
    return result;
};

//--> Controllo campo rating
function validateRating(rating) {
    //verifico input
    const result = integerNumberValidator(rating, "rating");

    if (!("value" in result)) return result

    const validatedRating = result.value;

    //controllo se numero fuori range
    if (validatedRating < 1 || validatedRating > 5) {
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
        transforms = [
            (v) => v.slice(0, 497),
            (v) => v + "..."
        ];
        //popola warning
        warning = {
            "comment": {
                reason: "text_too_long",
                details: {
                    originalLength: comment.length,
                    maxLength: 500
                },
                transformed: true,
            }
        }
    }

    //verifico input
    const result = stringValidator(
        comment,
        "comment",
        transforms
    );

    if (!("value" in result)) return result;

    return { ...result, ...(warning && { warning }) };

};

//--> Controllo campo Review_id
function validateReview_id(review_id) {
    const transforms = [(v) => v.toLowerCase()];
    //verifico input
    const result = stringValidator(
        review_id,
        "review_id",
        transforms
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

