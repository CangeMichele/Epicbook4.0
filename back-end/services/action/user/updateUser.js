// ***** MODIFCA DATI UTENTE ****

// ----- validatori
import { schemaValidator } from "../../validators/schemaValidator.js";
import { userDataValidators } from "../../validators/userDataValidators.js";
// ----- business rules
import { userDataBusinessRules } from "../../rules/userDataBusinessRules.js";
// ----- queries
import { getUserById, saveUpdateUser } from "../../queries/userQueries.js";

export async function updateUser(dataEdit) {

    //dichiarazione schema
    const schema = {
        allowedFields: [
            "_id",
            "firstName",
            "lastName",
            "birthDate",
            "email",
            "passwordList",
            "userName",
        ],
        requiredFields: ["_id"],
        validators: userDataValidators
    };

    //dati da caricare
    const updateData = {};
    //lista warning
    const warnings = {};

    //pulizia campi vuoti (non modificati)
    for (const [field, value] of Object.entries(dataEdit)) {
        if (value === null || value === "") {
            delete dataEdit[field]
        }
    }

    //validazione dati
    const validated = schemaValidator(dataEdit, schema);
    if (!validated.ok) return validated;

    //estrapolazione dati dal DB
    const dbUserData = await getUserById(dataEdit._id);

    //se presenti password, agginge dbUserData per utilizzare i metodi del documento mongoose
    if (dataEdit.passwordList) {
        validated.data.passwordList = {
            ...validated.data.passwordList,
            dbUserData
        }
    }

    //applico controlli su dati validati
    for (const [field, value] of Object.entries(validated.data)) {

        //NOTE: a nome campo validato corrisponde uguale nome chiave regola    
        if (field in userDataBusinessRules) {
            const rule = userDataBusinessRules[field];
            const result = await rule(value);
            if (!result.ok) return result;
        }

        //verifico cambiamenti e gestione passwordList

        //aggiungo password a updateData
        if (field === "passwordList") {
            updateData.password = value.newPasswords[0];
            continue;
        }
        if (field !== "passwordList" && dbUserData[field] === value) {
            warnings[field] = {
                reason: "not_change",
                accetpted: false,
            };
            continue;
        }

        updateData[field] = value;
    }

    //presenza campi da aggiornare
    if (!Object.keys(updateData).length) return {
        ok: false,
        error: {
            code: "BUSINESS_ERROR",
            reason: "no_change",
            message: "Non ci sono dati da aggiornare.",
            ...(warnings && { warnings })
        },
    };

    //salva e invia risposta
    const response = await saveUpdateUser(updateData);
    return { ...response, ...(warnings && { warnings }) };
}