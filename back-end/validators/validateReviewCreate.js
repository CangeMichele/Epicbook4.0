// *** CONTROLLO DATI PER POST ***

import { reviewValidators } from "./reviewValidators";

export function validateReviewCreate(newData) {

    //campi obbligatori
    const requiredFields = ["asin", "user_id", "rating", "comment"];

    //dati validati  
    const validatedReviewData = {};

    //lista warning
    const warnings = {};

    //controllo presenza campi obbligatori
    for (const field of requiredFields) {
        if (!(field in newData)) {
            return {
                status: false,
                details: `${field}_missing`,
                message: `Parametro ${field} mancante.`
            };
        }
    }


    //ciclo i nuovi dati e applcio i controlli
    for (const [field, value] of Object.entries(newData)) {

        //eseguo controllo di quel campo 
        const validationResult = reviewValidators[field](value);

        // se errore blocca e restituisci 
        if (!validationResult.status) {
            return validationResult;
        }

        //aggiungi campo a dati validati
        validatedReviewData[field] = validationResult.value

        //se presente gestisco il warning
        if (validationResult.warning) {
            warnings[field] = {
                details: validationResult.details,
                message: validationResult.message
            };
        }

        // costruzione risposta
        const response = {
            status: true,
            data: validatedReviewData
        };

        //aggiungo warnings se presenti
        if (Object.keys(warnings).length > 0) {
            response.warning = true;
            response.warnings = warnings;
        }

        return response;

    }
}
