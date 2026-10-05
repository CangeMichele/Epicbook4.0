// *** VALIDAZIONE PER PARAMETRI DI IMPAGINAZIONE ***

//--- validatori base
import {
    stringValidator,
    integerNumberValidator,
} from "./baseValidator.js";

// -------------------- PARAMETRI DA VALIDARE --------------------

//--> parametro impaginazione page 
function validatePage(page) {
    const result = integerNumberValidator("page", page);
    return result;
};

//--> parametro impaginazione limit 
function validateLimit(limit) {
    const result = integerNumberValidator("limit", limit);
    return result;
};

//--> parametro impaginazione sort 
function validateSort(sort) {
    const result = stringValidator("sort", sort, []);
    return result;
};

//--> parametro impaginazione sortDirection 
function validateSortDirection(sortDirection) {
    const result = integerNumberValidator("sortDirection", sortDirection);
    return result;
};

// --------------------------   EXPORT WRAPPER   --------------------------------------
export const paginationValidators = {
    page: validatePage,
    limit: validateLimit,
    sort: validateSort,
    sortDirection: validateSortDirection,
};