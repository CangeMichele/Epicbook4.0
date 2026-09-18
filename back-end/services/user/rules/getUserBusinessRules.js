// *** REGOLE BUSINESS QUERIES UTENTE ***

//----- queries
import { } from "../queries/userQueries.js";

//--> controllo presenza parametri
function hasParams(query) {
    const params = query.params;

    if (!params || !Object.keys(params).length) {
        return {
            ok: false,
            error: {
                code: "BUSINESS_ERROR",
                reason: "empty_params",
                message: "Nessun parametro adatto trovato.",
            },
    }
}

return { ok: true }
};

//--> controllo parametro impaginazione page 
function checkPage(page) {
    if (page <= 0) {
        return {
            ok: true,
            error: {
                code: "BUSINESS_ERROR",
                reason: "invalid_pagination",
                message: "Parametro impaginazione non valido",
                details: { param: "page", value: page },
            }
        }
    }

    return { ok: true }
};

//--> controllo parametro impaginazione limit 
function checkLimit(limit) {
    //limite visualizzazione
    const max = 20;

    if (limit > max) {
        return {
            ok: false,
            error: {
                code: "BUSINESS_ERROR",
                reason: "invalid_pagination",
                message: "Limite impaginazione superato",
                details: { params: "limit", value: limit },
            }
        }
    }

    return { ok: true }
};

//--> controllo parametro impaginazione sort 
function checkSort(sort) {
    //parametri consentiti per ordinamento
    const allowedSort = ["firstName", "lastName", "userName", "createdAt"]
    if (!allowedSort.includes(sort)) {
        return {
            ok: false,
            error: {
                code: "BUSINESS_ERROR",
                reason: "invalid_pagination",
                message: "Parametro ordinamento non consentito",
                details: { params: "sort", value: sort },
            }
        }
    }

    return { ok: true }
};

//--> controllo parametro impaginazione sortDirection 
function checkSortDirection(sortDirection) {

    if (sortDirection !== 1 && sortDirection !== -1) {
        return {
            ok: false,
            error: {
                code: "BUSINESS_ERROR",
                reason: "invalid_pagination",
                message: "Parametro ordinamento non consentito",
                details: { params: "sortDirection", value: sortDirection },
            }
        }
    }

    return { ok: true }
};


// --------------------------   EXPORT WRAPPER   --------------------------------------
export { hasParams };

export const getUserBusinessRules = {
    page: checkPage,
    limit: checkLimit,
    sort: checkSort,
    sortDirection: checkSortDirection,
}