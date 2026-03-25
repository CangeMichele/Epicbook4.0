// *** CONTROLLO PARAMETRI PER GET ***

import { reviewValidators } from "./reviewValidators";

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
                details: `${field}_not_allowed`,
                message: `Parametro ${field} non valido per ricerca.`
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

    // costruzione risposta
    const response = {
        status: true,
        data: validatedQuery
    };
    
    //aggiungo warnings se presenti
    if (Object.keys(warnings).length > 0) {
        response.warning = true;
        response.warnings = warnings;
    }

    return response;

}
