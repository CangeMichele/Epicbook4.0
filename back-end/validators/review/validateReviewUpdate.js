// *** CONTROLLO DATI PER PUT ***

import { reviewValidators } from "./reviewValidators.js";

export function validateReviewUpdate(updateData) {

    //lista campi consentiti
    const allowedFields = ["comment", "rating"];

    //lista non aggiornabili
    const immutableFields = ["user_id", "asin", "review_id"]

    //dati validati
    const validatedUpdateData = {};

    //lista warning
    const warnings = {};

    //ciclo i nuovi dati, confronto con quelli vecchi e applcio i controlli
    for (const [field, value] of Object.entries(updateData)) {

        //se campo non aggiornabile
        if (immutableFields.includes(field)) {
            warnings[field] = {
                code: "VALIDATION_WARNING",
                reason: `not_updated_field`,
                message: `Campo ${field} non aggiornabile.`,
                details: {
                    field,
                    value,
                    allowed: false
                },
            };
            continue;
        }

        //se campo non consentito aggiungo warning list e ignora 
        if (!allowedFields.includes(field)) {
            warnings[field] = {
                code: "VALIDATION_WARNING",
                reason: `not_allowed_field`,
                message: `Campo ${field} non ammesso.`,
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
        validatedUpdateData[field] = validationResult.value;

        //se presente gestisco il warning
        if (validationResult.warning) {
            warnings[field] = validationResult.warning;
        }
    }

    // se nessun dato 
    if (Object.keys(validatedUpdateData).length === 0) {
        return {
            ok: true,
            data: {},
            meta: {
                code: "NO_CHANGE",
                reason: "invalid_fields",
                message: "Nessun campo valido da aggiornare.",
                details: { attempted: updateData }
            },
            ...(Object.keys(warnings).length > 0 && { warnings })

        }
    }

    //se non si è bloccato prima, dati validi
    return {
        ok: true,
        data: validatedUpdateData,
        ...(Object.keys(warnings).length > 0 && { warnings })
    };

}

