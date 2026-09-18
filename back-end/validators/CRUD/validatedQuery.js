// *** CONTROLLO PARAMETRI PER GET ***

export function validatedQuery(params, schema) {

    //estrapolazione da schema
    const { allowedParams, requiredParams, validators } = schema;

    //parametri query validati  
    const validatedQuery = {};

    //lista warning
    const warnings = {};

    //paginazione
    let pagination = {}
    const paginationParams = ["page", "limit", "sort", "sortDirection"]
    const defaultPagination = {
        page: 1,
        limit: 10,
        sort: "createdAt",
        sortDirection: 1,
    }

    //controllo presenza schema
    if (!allowedParams || !requiredParams || !validators) {
        return {
            ok: false,
            error: {
                code: "SCHEMA_ERROR",
                reason: "missing_params",
                message: `Schema incompleto.`,
                details: {
                    params: {
                        allowedParams: !!allowedParams,
                        requiredParams: !!requiredParams,
                        validators: !!validators
                    }
                }
            }
        }
    }

    //ciclo per validare parametri query
    for (const [field, val] of Object.entries(params)) {

        //se parametro non consentito aggiunge a warning list e ignora 
        if (!allowedParams.includes(field)) {
            warnings[field] = {
                reason: "not_allowed_field",
                accepted: false,
            };
            continue;
        }

        //controllo presenza validatore 
        const validator = validators[field];

        let validatedParam = val
        if (validator) {
            //eseguo validazione
            const validationResult = validator(val);

            // se errore in validazione
            if (!("value" in validationResult)) {
                return {
                    ok: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        ...validationResult
                    },
                    ...(Object.keys(warnings).length && { warnings })
                }
            }

            validatedParam = validationResult.value
        }

        //divido parametri da paginazione
        if (paginationParams.includes(field)) {
            pagination[field] = validatedParam;
        } else {
            validatedQuery[field] = validatedParam;
        }
    }

    //se c'è paginazione applico default su eventuali campi mancanti
    if (Object.keys(pagination).length) {
        pagination = {
            ...defaultPagination,
            ...pagination
        };
        pagination.skip = (pagination.page - 1) * pagination.limit

    }

    //controllo parametri obbligatori
    for (const param of requiredParams) {
        if (!(param in validatedQuery)) {
            return {
                ok: false,
                error: {
                    code: "VALIDATION_ERROR",
                    reason: "required_params_missing",
                    message: "Parametro obbligatorio mancante",
                    details: { param }
                },
                ...(Object.keys(warnings).length && { warnings })
            }
        }
    }

    // se non si è bloccato prima, parametri validi
    return {
        ok: true,
        data: {
            params: validatedQuery,
            ...(Object.keys(pagination).length && { pagination }),
        },
        ...(Object.keys(warnings).length && { warnings })
    };

};