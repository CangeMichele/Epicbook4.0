// ***** RICERCA LIBRI PER PARAMETRI ****
// ----- validatori
import { schemaValidator } from "../../validators/schemaValidator.js";
import { booksValidators } from "../../validators/booksValidator.js";
import { paginationValidators } from "../../validators/paginationValidators.js"
// ----- business rules
import { paginationBusinessRules } from "../../rules/paginationBusinessRules.js"
// ----- queries
import { getBooksbyParams } from "../../queries/bookQueries.js";

export async function getBooks(params) {

    //dichiarazione schema
    const schema = {
        allowedFields: [
            "asin",
            "title",
            "category",
            "_id",
            "page",
            "limit",
            "sort",
            "sortDirection"
        ],
        requiredFields: [
        ],
        validators: { ...booksValidators, ...paginationValidators }
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

    //verico presenza di uno solo fra asin e category
    const asin = validated.data.asin || null;
    const category = validated.data.category || null;
    if ((asin && category) || (!asin && !category)) return {
        ok: false,
        error: {
            code: "VALIDATION_ERROR",
            reason: "illegal_params",
            message: "Inserire uno solo fra category e asin.",
            details: {asin, category}
        }
    }


    //applico controlli su dati validati
    for (const [param, value] of Object.entries(validated.data)) {

        //NOTE: a nome campo validato corrisponde uguale nome campo regola 
        //regole campi impaginazione
        if (param in paginationBusinessRules) {
            const rule = paginationBusinessRules[param];
            const result = await rule(value);
            if (!result.ok) return result
        }
    }

    //invia query
    const response = await getBooksbyParams(validated.data);
    return response;
}