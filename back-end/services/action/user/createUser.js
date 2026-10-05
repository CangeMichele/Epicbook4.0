// ***** CREAZIONE NUOVO UTENTE ****

// ----- validatori
import { schemaValidator } from "../../validators/schemaValidator.js";
import { userDataValidators } from "../../validators/userDataValidators.js";
// ----- business rules
import { userDataBusinessRules } from "../../rules/userDataBusinessRules.js";
// ----- queries
import { saveNewUser } from "../../queries/userQueries.js";

export async function createUser(inputData) {

    //dichiarazione schema
    const schema = {
        allowedFields: [
            "firstName",
            "lastName",
            "birthDate",
            "email",
            "passwordList",
            "userName",
            "avatar_id",
            "avatar_url",
        ],
        requiredFields: [
            "firstName",
            "lastName",
            "birthDate",
            "email",
            "passwordList",
            "userName"
        ],
        validators: userDataValidators
    };

    //eseguo validazione
    const validated = schemaValidator(inputData, schema);
    if (!validated.ok) return validated;
    
    //dati da caricare
    const newData = {};

    //applico controlli su dati validati
    for (const [field, value] of Object.entries(validated.data)) {

        //NOTE: a nome campo validato corrisponde uguale nome campo regola     
        if (field in userDataBusinessRules) {
            const rule = userDataBusinessRules[field];
            const result = await rule(value);
            if (!result.ok) return result;
        }

        //aggiungo a dati newData
        if (field === "passwordList") {
            newData.password = value.newPasswords[0];
        } else {
            newData[field] = value;
        }
    }

    //salva e invia risposta
    const response = await saveNewUser(newData);
    return response;

};