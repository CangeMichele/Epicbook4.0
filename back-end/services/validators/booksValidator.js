// *** VALIDAZIONE PER CAMPI DI BOOKS ***

//--- validatori base
import { stringValidator, } from "./baseValidator.js";

// -------------------- CAMPI DA VALIDARE --------------------
//--> Controllo per campo asin
function validateAsin(asin) {
    //verifico input
    const result = stringValidator(
        "asin",
        asin
    )
    return result
};

//--> Controllo per campo title
function validateTitle(title) {
    //verifico input
    const result = stringValidator(
        "title",
        title
    )
    return result
};

//--> Controllo per campo category
function validateCategory(category) {
    //verifico input
    const result = stringValidator(
        "category",
        category
    )
    return result
};

// --> Controllo campo _id
function validateBook_id(_id) {
    //verifico input
    const result = stringValidator(
        "_id",
        _id
    )
    return result;
};

// --------------------------   EXPORT WRAPPER   --------------------------------------
export const booksValidators = {
    asin:validateAsin,
    title: validateTitle,
    category: validateCategory,
    _id: validateBook_id
};