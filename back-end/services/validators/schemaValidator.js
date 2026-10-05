// *** VALIDAZONE DATI TRAMITE SCHEMA***

export function schemaValidator(inputData, schema) {

    //estrapolazione da schema
    const { allowedFields, requiredFields, validators } = schema;

    //dati validati  
    const validatedData = {};
    //lista warning
    const warnings = {};

    //controllo struttura schema
    if (!allowedFields || !requiredFields || !validators) {
        return {
            ok: false,
            error: {
                code: "SCHEMA_ERROR",
                reason: "missing_params",
                message: `Schema incompleto.`,
                details: {
                    params: {
                        allowedFields: !!allowedFields,
                        requiredFields: !!requiredFields,
                        validators: !!validators
                    }
                }
            }
        }
    }

    //controllo campi obbligatori
    for (const field of requiredFields) {
        if (!(field in inputData)) {
            return {
                ok: false,
                error: {
                    code: "VALIDATION_ERROR",
                    reason: "required_field_missing",
                    message: "Campo obbligatorio mancante.",
                    details: { field }
                }
            }
        }
    }

    //ciclo per validare campi dati input
    for (const [field, value] of Object.entries(inputData)) {

        //se campo  non ammesso -> non consentito aggiunge a warning list e ignora 
        if (!(allowedFields.includes(field))) {
            warnings[field] = {
                reason: "not_allowed_field",
                accepted: false
            };
            continue;
        }

        //controllo presenza validatore 
        const validator = validators[field];
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

        //aggiungo campo a dati validati
        validatedData[field] = validationResult.value;

        //eventuale warning
        if (validationResult.warning) {
            warnings[field] = validationResult.warning;
        }
    }

    //se non si è bloccato prima, dati validati
    return {
        ok: true,
        data: validatedData,
        ...(Object.keys(warnings).length && { warnings })
    }
}