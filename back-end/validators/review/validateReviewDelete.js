// *** CONTROLLO PARAMETRI PER DELETE ***

import { reviewValidators } from "./reviewValidators.js";

export function validateReviewDelete(toDelete) {

    //parametri consentiti
    const allowedParams = ["asin", "review_id"];

    //parametri da validare
    const hasAsin = toDelete.asin !== undefined;
    const hasReview = toDelete.review_id !== undefined;

    //lista warning
    const warnings = {};

    //cilco per vede se campi consetiti
    for (field of Object.keys(toDelete)) {

        //se parametro non consentito aggiunge a warning list e ignora 
        if (!allowedParams.includes(field)) {
            warnings[field] = {
                details: `field_not_allowed`,
                message: `Parametro "${field}" ignorayo. Non valido come campo per eliminazione.`
            };
            continue;
        }
    }

    //blocca se presente asin + review
    if (hasAsin && hasReview) {
        return {
            status: false,
            details: `params_conflict`,
            message: "Parametri in conflitto.",
            data: toDelete
        };
    }

    // validazione review_id
    if (hasReview) {
        const validation = reviewValidators["review_id"](toDelete.review_id);
        //se validazione non riuscita
        if (!validation.status) return validation;

        //se validazione ok
        return {
            status: true,
            data: { review_id: validation.value },
            ...(Object.keys(warnings).length > 0
                ? { warning: true, warnings: warnings }
                : {}
            )
        }
    }

    // validazione asin
    if (hasAsin) {
        const validation = reviewValidators["asin"](toDelete.asin);
        //se validazione non riuscita
        if (!validation.status) return validation;

        //se validazione ok
        return {
            status: true,
            data: { asin: validation.value },
            ...(Object.keys(warnings).length > 0
                ? { warning: true, warnings: warnings }
                : {}
            )
        }
    }

    //se non si blocca prima allora parametri mancanti
    return {
        status: false,
        details: "params_missing",
        message: "Parametri mancanti. Inserire asin o review_id",
        data: toDelete,
        ...(Object.keys(warnings).length > 0
            ? { warning: true, warnings: warnings }
            : {}
        )
    }

}