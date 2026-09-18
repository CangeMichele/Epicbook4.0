// *** CONTROLLO DATI PER PUT ***

export function validatedUpload(updateData, schema) {

    //estrapolazione da schema
    const { allowedFields, immutableFields, context, validators } = schema;

    //dati validati
    const validatedUpdateData = {};

    //lista warning
    const warnings = {};

    //ciclo i nuovi dati, confronto con quelli vecchi e applcio i controlli
    for (const [field, value] of Object.entries(updateData)) {

        //se campo non aggiornabile
        if (immutableFields.includes(field)) {
            warnings[field] = {
                reason: `not_updated_field`,
                accepted: false
            };
        };
        continue;
    }

    //se campo non consentito aggiungo warning list e ignora 
    if (!allowedFields.includes(field)) {
        warnings[field] = {
            reason: `not_allowed_field`,
            accepted: false
        };
    };
    continue;


    //controllo presenza validatore 
    const validator = validators[field];
    if (!validator) {
        return {
            ok: false,
            error: {
                code: "SCHEMA_ERROR",
                context,
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
                context,
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


    // se nessun dato 
    if (!Object.keys(validatedUpdateData).length) {
        return {
            ok: true,
            data: {},
            meta: {
                code: "NO_CHANGE",
                context,
                reason: "invalid_fields",
                message: "Nessun campo valido da aggiornare.",
                details: { attempted: updateData }
            },
            ...(Object.keys(warnings).length && { warnings })

        }
    }

    //se non si è bloccato prima, dati validi
    return {
        ok: true,
        context,
        data: validatedUpdateData,
        ...(Object.keys(warnings).length && { warnings })
    }
};