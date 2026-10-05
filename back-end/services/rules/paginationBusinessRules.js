// *** REGOLE BUSINESS IMPAGINAZIONE ***

//--- CONTROLLO PARAMETRO PAGE ----- 
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

//--- CONTROLLO PARAMETRO LIMIT ----- 
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

//--- CONTROLLO PARAMETRO SORT ----- 
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

//--- CONTROLLO PARAMETRO SORTDIRECTION ----- 
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

export const paginationBusinessRules = {
    page: checkPage,
    limit: checkLimit,
    sort: checkSort,
    sortDirection: checkSortDirection,
}