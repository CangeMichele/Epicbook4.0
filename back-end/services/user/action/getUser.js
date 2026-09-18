// ***** RICERCA UTENTI PER PARAMETRI ****

// ----- validatori
import { validatedQuery } from "../../../validators/CRUD/validatedQuery.js";
import { userQueryValidators } from "../../../validators/user/userQueyValidators.js";
// ----- queries
import { getUserbyParams } from "../queries/userQueries.js";
// ----- business rules
import { getUserBusinessRules, hasParams } from "../rules/getUserBusinessRules.js";

export async function getUser(params) {

    //dichiarazione schema
    const schema = {
        allowedParams: [
            "firstName",
            "lastName",
            "email",
            "userName",
            "_id",
            "page",
            "limit",
            "sort",
            "sortDirection"
        ],
        requiredParams: [
        ],
        validators: userQueryValidators
    };

    //validazione parametri
    const validated = validatedQuery(params, schema);
    if (!validated.ok) return validated;


    //applico controlli su parametri validati
    //NOTE: a nome campo validato corrisponde uguale nome chiave regola

    //presenza parametri
    const checkParam = hasParams(validated.data);
    if (!checkParam.ok) return {
        ...checkParam,
        ...(validated?.warnings && { warnings: validated.warnings })
    };

    //regole per parametro
    for (const [param, value] of Object.entries(validated.data)) {
        if (param in getUserBusinessRules) {
            const rule = getUserBusinessRules[param];

            const result = await rule(value);
            if (!result.ok) return result;
        }
    }

    //invia query
    const response = await getUserbyParams(validated.data);
    return response;
};
