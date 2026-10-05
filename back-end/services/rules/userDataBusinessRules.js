// *** REGOLE BUSINESS DATI UTENTE ***

//----- queries
import { getUserByEmail, getUserNamesByPrefix } from "../queries/userQueries.js";

//----- CONTROLLO ETA' MINIMA -----
function checkMinAge(birthDate) {
    //data nascita utente
    const userAge = new Date(birthDate);
    //età minima
    const minAge = 16;

    //calcolo quando età di user diventa valida (sommo anno nascita + età minima)
    userAge.setFullYear(userAge.getFullYear() + minAge);
    
    //data di oggi
    const today = new Date();
    
    //confronto la data di oggi con data valida per user.
    if (today < userAge) {
        return {
            ok: false,
            error: {
                code: "BUSINESS_ERROR",
                reason: "invalid_age",
                message: "Deve avere almeno 16 anni per poterti registrare.",
                details: { field: "birthDate", value: birthDate },
            }
        };
    }

    return { ok: true }
};

//---- CONTROLLO UNIVOCITA' EMAIL -----
async function uniqueEmail(email) {

    const response = await getUserByEmail(email);

    //se esiste allora è già presente
    if (response) {
        return {
            ok: false,
            error: {
                code: "BUSINESS_ERROR",
                reason: "duplicate_email",
                message: `${email} già inserita. Riprova con un email diversa.`,
                details: { field: "email", value: email }
            }
        }
    }
    // se non esiste è nuovo quindi ok
    return { ok: true }
};

//----- CONTROLLO UNIVOCITA' USERNAME + EVENTUALE SUGGERIMENTO -----
async function duplicateUserName(inputUserName) {

    //verifico se ci username con lo stesso prefisso (es. Mario, Mario2 e MarioBros)
    const userNameList = await getUserNamesByPrefix(inputUserName)
    //se lista vuota, userName valido
    if (!userNameList.length) return { ok: true }

    //verifico corrispondenza esatta fra userName input e nel DB (da elenco prefisso)
    const existedUserName = userNameList.some(
        (user) => user.userName.toLowerCase() === inputUserName.toLowerCase()
    );
    // se non c'è corrispondenza estta, userName valido
    if (!existedUserName) return { ok: true }

    // USERNAMNE GIA' INSERITO -> SUGGERIMENTO

    //divido userName in parte numerica finale e tutto ciò che c'è prima
    const userNameParts = inputUserName.match(/^(.*?)(\d+)$/);

    //suggerimento alternariva
    let suggestUserName = "";

    //se non ha numero lo aggiungo
    if (!userNameParts) {
        suggestUserName = inputUserName + "1"

    } else {
        //se esiste parte numerica cerco il primo suggerimento disponibile
        const prefix = userNameParts[1];

        let i = 1;
        while (true) {
            const candidate = prefix.toLowerCase() + i;
            const suggestTest = userNameList.some(
                (user) => user.userName.toLowerCase() === candidate
            );

            if (!suggestTest) {
                suggestUserName = candidate;
                break;
            }

            i++;
        }
    }

    //  ritorna suggerimento e errore 
    return {
        ok: false,
        error: {
            code: "BUSINESS_ERROR",
            reason: "existed_userName",
            message: `${inputUserName} è stato utilizzato ! Prova con ${suggestUserName}.`,
            details: {
                field: "userName",
                value: inputUserName,
                suggest: suggestUserName
            }
        }
    }

};

//---- CONTROLLO PASSWORD -----
async function checkPassword(passwordList) {
    const {newPasswords, oldPassword, dbUserData} = passwordList;
    const reference = newPasswords[0];

    //controllo corispondenza nuove password
    const matchNewPassword = newPasswords.every(
        (password) => password === reference
    );

    if (!matchNewPassword) {
        return {
            ok: false,
            error: {
                code: "BUSINESS_ERROR",
                reason: "mismatch_password",
                message: "Le nuove password non corrispondono.",
                details: { field: "password" }
            }
        }
    }

    // se oldPassword è presente si è in modalità update
    if (oldPassword) {
        //utilizzo documento mongose per usare metodo comparePassword
        const comparePassword = await dbUserData.comparePassword(oldPassword);

        //verifico corrispondenza nel DB
        if (!comparePassword) {
            return {
                ok: false,
                error: {
                    code: "BUSINESS_ERROR",
                    reason: "mismatch_password",
                    message: "Password non corrispondente a quella registrata.",
                    details: { field: "oldPassword" }
                }
            }
        }

        //verifico se realmente è una nuova password
        if (oldPassword === reference) {
            return {
                ok: false,
                error: {
                    code: "BUSINESS_ERROR",
                    reason: "not_new_password",
                    message: "La nuova password non può essere uguale alla precedente.",
                    details: { field: "password" }
                }
            }
        }

    }

    return { ok: true }

};


// --------------------------   EXPORT WRAPPER   --------------------------------------
export const userDataBusinessRules = {
    birthDate: checkMinAge,
    email: uniqueEmail,
    userName: duplicateUserName,
    passwordList: checkPassword
}