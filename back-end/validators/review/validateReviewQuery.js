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
                code: "VALIDATION_WARNING",
                reason: "not_allowed_field",
                field,
                message: `Parametro ${field} non ammesso.`,
                details: { field, value }
            };
            continue;
        }

        //controllo presenza validatore 
        const validator = reviewValidators[field];
        if (!validator) {
            return {
                ok: false,
                error: {
                    code: "SCHEMA_ERROR",
                    reason: "missing_validator",
                    message: `Nessuna validazione possibile per campo ${field}.`,
                    details: { field }
                },
            }
        };

        //eseguo validazione
        const validationResult = validator(value);


        // NOTE: 
        // parametri non validi non bloccano ma ignorati e aggiunti a warning

        const isInvalid = !("value" in validationResult);
        const hasWarning = "warning" in validationResult;

        if (isInvalid) {
            warnings[field] = {
                code: "VALIDATION_WARNING",
                ...validationResult
            };
            continue;
        }

        //se presente warning, accetto e segnalo
        if (hasWarning) {
            warnings[field] = {
                code: "VALIDATION_WARNING",
                ...validationResult.warning
            };
        }

        //altrimenti aggiunge a parametri query
        validatedQuery[field] = validationResult.value;
    }

    //NOTE: evitare chiamate senza query che mostrano tutto il DB.
    // se nessun parametro invia errore 
    if (Object.keys(validatedQuery).length === 0) {
        return {
            ok: false,
            error: {
                code: "EMPTY_PARAMS",
                reason: "empty_params",
                message: "Nessun parametro di ricerca inserito o valido.",
                details: {
                    attempted: query
                }
            }
        }
    }

    // se non si è bloccato prima, dati validi
    return {
        ok: true,
        data: validatedQuery,
        ...(Object.keys(warnings).length > 0 && { warnings })
    };

}
