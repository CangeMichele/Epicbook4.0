// *** CONTROLLO DATI PER POST ***

import { reviewValidators } from "./reviewValidators.js";

export function validateReviewCreate(newData) {

    //campi ammessi
    const allowedFields = ["asin", "user_id", "rating", "comment"];

    //campi obbligatori
    const requiredFields = ["asin", "user_id", "rating", "comment"];

    //dati validati  
    const validatedReviewData = {};

    //lista warning
    const warnings = {};

    //validazione dati
    for (const [field, value] of Object.entries(newData)) {

        //se campo non ammesso warning e continua
        if (!allowedFields.includes(field)) {
            warnings[field] = {
                code: "VALIDATION_WARNING",
                reason: "not_allowed_field",
                message: `Parametro ${field} non ammesso.`,
                details: {
                    field,
                    value,
                    allowed: false
                },
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

        // se errore in validazione
        if (!("value" in validationResult)) {
            return {
                ok: false,
                error: {
                    code: "VALIDATION_ERROR",
                    ...validationResult
                }
            }
        }

        //aggiungi campo a dati validati
        validatedReviewData[field] = validationResult.value

        //se presente gestisco il warning
        if (validationResult.warning) {
            warnings[field] = validationResult.warning;
        }
    }

    //controllo campi obbligatori
    for (const field of requiredFields) {
        if (!(field in validatedReviewData)) {
            return {
                ok: false,
                error: {
                    code: "VALIDATION_ERROR",
                    reason: "required_field_missing",
                    message: `Parametro obbligatorio mancante: ${field}`,
                    details: { field }
                }
            }
        }
    }


    //se non si è bloccato prima, dati validati
    return {
        ok: true,
        data: validatedReviewData,
        ...(Object.keys(warnings).length > 0 && { warnings })
    }
}