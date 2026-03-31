// *** CONTROLLO PARAMETRI PER GET ***

import { reviewValidators } from "./reviewValidators.js";

export function validateReviewQuery(query) {

    //parametri consentiti
    const allowedParams = ["asin", "user_id", "rating"];

    //parametri query validati  
    const validatedQuery = {};

    //lista warning
    const warnings = {};

    //ciclo per validare dati query
    for (const [field, value] of Object.entries(query)) {

        //se parametro non consentito aggiunge a warning list e ignora 
        if (!allowedParams.includes(field)) {
            warnings[field] = {
                details: `field_not_allowed`,
                message: `Parametro "${field}" non valido per ricerca.`
            };
            continue;
        }

        //eseguo validazione
        const validationResult = reviewValidators[field](value);

        // se validazione non valida o genera warning aggiunge a warning list e ignora 
        if (!validationResult.status || validationResult.warning) {
            warnings[field] = {
                details: validationResult.details,
                message: validationResult.message
            };
            continue;
        }

        //altrimenti aggiunge a parametri query
        validatedQuery[field] = validationResult.value;
    }

    // se nessun parametro invia errore 
    if (Object.keys(validatedQuery).length === 0) {
        return {
            status: false,
            details: "empty_params",
            message: "Nessun parametro di ricerca inserito o valido."

        }
    }

// se non si è bloccato prima, dati validi
    return  {
        status: true,
        data: validatedQuery,
        ...(Object.keys(warnings).length > 0)
        ? { warning: true, warnings: warnings }
        : {}
    };
    
}
