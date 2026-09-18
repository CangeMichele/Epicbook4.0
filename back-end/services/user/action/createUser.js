// ***** CREAZIONE NUOVO UTENTE ****

// ----- validatori
import { validatedInputData } from "../../../validators/CRUD/validatedInputData.js";
import { userDataValidators } from "../../../validators/user/userDataValidators.js";
// ----- business rules
import { dataUserBusinessRules } from "../rules/dataUserBusinessRules.js";
// ----- queries
import { saveNewUser } from "../queries/userQueries.js";

export async function createUser(inputData) { 
        
    //dati da caricare
    const newData = {};
    
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

    //validazione dati
    const validated = validatedInputData(inputData, schema);
    if (!validated.ok) return validated;

    //applico controlli su dati validati
    for (const [field, value] of Object.entries(validated.data)) {        
        
        //NOTE: a nome campo validato corrisponde uguale nome chiave regola    
        if (field in dataUserBusinessRules) {
            const rule = dataUserBusinessRules[field];
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