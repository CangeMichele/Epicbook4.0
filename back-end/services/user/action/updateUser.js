// ***** MODIFCA DATI UTENTE ****

// ----- validatori
import { validatedInputData } from "../../../validators/CRUD/validatedInputData.js";
import { userDataValidators } from "../../../validators/user/userDataValidators.js";
// ----- business rules
import { dataUserBusinessRules } from "../rules/dataUserBusinessRules.js";
// ----- queries
import { getUserById, saveUpdateUser  } from "../queries/userQueries.js";

export async function updateUser(dataEdit) {

    //dati da caricare
    const updateData = {};
    //lista warning
    const warnings = {};

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

    //pulizia campi vuoti (non modificati)
    for (const [field, value] of Object.entries(dataEdit)) {
        if (value === null || value === "") {
            delete dataEdit[field]
        }
    }

    //validazione dati
    const validated = validatedInputData(dataEdit, schema);

    //estrapolazione dati dal DB
    const dbUserData = await getUserById(dataEdit._id);

    //rimodellazione passwordList
    validated.data.passwordList = {
        ...validated.data.passwordList,
        dbUserData //mi porto il documento mongoose per utilizzarne i metodi
    }

    //applico controlli su dati validati
    for (const [field, value] of Object.entries(validated.data)) {

        //NOTE: a nome campo validato corrisponde uguale nome chiave regola    
        if (field in dataUserBusinessRules) {
            const rule = dataUserBusinessRules[field];
            const result = await rule(value);
            if (!result.ok) return result;
        }

        //verifica cambiamenti
        //NB: passwordList già gestita da validator e da businessRules
        if (field !== "passwordList"  && oldData[field] === value) {
            warnings[field] = {
                reason: "not_change",
                accetpted: false,
            };
            continue;
        }

        //aggiungo password a updateData
        if (field === "passwordList") {
            updateData.password = value.newPasswords[0];
            continue;
        }
        updateData[field] = value;
    }

    //se nessun campo modificato
    const result = dataUserBusinessRules.checkUpdateUser(updateData);
    if (!result.ok) return result;

    //salva e invia risposta
    const response = await saveUpdateUser(dataEdit._id, updateData);
    return { ...response, warnings };
}