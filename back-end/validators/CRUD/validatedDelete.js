// *** CONTROLLO PARAMETRI PER DELETE ***

export function validatedDelete(toDelete, schema) {

    //estrapolazione da schema
    const { allowedParams, context, validators } = schema;

    //lista warning
    const warnings = {};

    //parametri validati
    const validatedParams = {}


    //cilco per vede se campi consetiti
    for (const [field, value] of Object.entries(toDelete)) {

        //se parametro non consentito aggiunge a warning list e ignora 
        if (!allowedParams.includes(field)) {
            warnings[field] = {
                reason: "not_allowed_field",
                accepted: false
            };
            continue;
        }

        //verifico esistenza validatore
        const validator = validators[field];
        if (!validator) {
            return {
                ok: false,
                error: {
                    context,
                    code: "SCHEMA_ERROR",
                    reason: "missing_validator",
                    message: `Nessuna validazione possibile per campo ${field}`,
                    details: { field },
                },
            }
        }

        //eseguo validazione
        const validationResult = validator(toDelete[field]);

        // se errore in validazione
        if (!("value" in validationResult)) {
            return {
                ok: false,
                error: {
                    context,
                    code: "VALIDATION_ERROR",
                    ...validationResult
                }
            }
        }

        //aggiungo a parametri validati
        validatedParams[field] = value;
    }

    //restituisco paramentri validati
    if (!Object.keys(validatedParams).length) {
        return {
            ok: false,
            error: {
                context,
                code: "VALIDATION_ERROR",
                reason: "empty_params",
                message: "Nessun parametro validato",
                details: {
                    attempted: toDelete,
                    validated: {},
                    ...(Object.keys(warnings).length && { warnings })
                }
            }
        }
    }

    //se validazione a buon fine
    return {
        ok: true,
        context,
        data: validatedParams,
        ...(Object.keys(warnings).length && { warnings })
    }
};
