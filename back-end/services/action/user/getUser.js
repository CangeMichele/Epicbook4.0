// ***** RICERCA UTENTI PER PARAMETRI ****

// ----- validatori
import { schemaValidator } from "../../validators/schemaValidator.js";
import { userDataValidators } from "../../validators/userDataValidators.js";
import { paginationValidators } from "../../validators/paginationValidators.js"
// ----- business rules
import {userDataBusinessRules} from "../../rules/userDataBusinessRules.js"
import {paginationBusinessRules} from "../../rules/paginationBusinessRules.js"
// ----- queries
import { getUserbyParams } from "../../queries/userQueries.js";

export async function getUser(params) {

    //dichiarazione schema
    const schema = {
        allowedFields: [
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
        requiredFields: [
        ],
        validators: { ...userDataValidators, ...paginationValidators }
    };

    //validazione parametri
    const validated = schemaValidator(params, schema);
    if (!validated.ok) return validated;


    //applico controlli su parametri validati

    //presenza parametri
    if (!Object.keys(validated.data).length) return {
        ok: false,
            error: {
                code: "BUSINESS_ERROR",
                reason: "empty_params",
                message: "Nessun parametro adatto trovato.",
                ...(validated?.warnings && { warnings: validated.warnings })
            },
    };


    //applico controlli su dati validati
    for (const [param, value] of Object.entries(validated.data)) {

        //NOTE: a nome campo validato corrisponde uguale nome campo regola 
        //regole campi impaginazione
        if(param in paginationBusinessRules){
            const rule = paginationBusinessRules[param];
            const result = await rule(value);
            if(!result.ok) return result
        }

    }

    //invia query
    const response = await getUserbyParams(validated.data);
    return response;
};
