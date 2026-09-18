// *** REGOLE BUSINESS DATI UTENTE ***

//----- queries
import { getUserByEmail, getUserNamesByPrefix } from "../queries/userQueries.js";

//--> controllo erà minima per iscrizione
function checkMinAge(birthDate) {
    //da stringa a Date
    const userAge = new Date(birthDate);

    const minAge = 16;

    //sommo data di nascita e età minima
    userAge.setFullYear(userAge.getFullYear() + minAge);

    const today = new Date();

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

//--> controllo univocità email
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

//--> controllo univocità username + eventuale suggerimento
async function duplicateUserName(inputUserName) {

    const userNameList = await getUserNamesByPrefix(inputUserName)
    //se lista vuota, userName valido
    if (!userNameList.length) return { ok: true }


    const existedUserName = userNameList.some(
        (user) => user.userName.toLowerCase() === inputUserName.toLowerCase()
    );
    // se non c'è corrispondenza estta, userName valido
    if (!existedUserName) return { ok: true }


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

//--> controllo validità requisiti password
async function checkPassword(passwordList) {
    const {newPasswords, oldPassword, dbUserData} = passwordList;
    const reference = newPasswords[0];

    //controllo corispondenza nuove password
    const matchpassword = newPasswords.every(
        (password) => password === reference
    );

    if (!matchpassword) {
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

//--> controlli generici su upadate
async function checkUpdateUser(updateData) {

    //controlla se documento vuoto
    if (!Object.keys(updateData).length) {
        return {
            ok: false,
            error: {
                code: "BUSINESS_ERROR",
                reason: "no_change",
                message: "Non ci sono dati da aggiornare."
            }
        }
    }

    return { ok: true }

}

// --------------------------   EXPORT WRAPPER   --------------------------------------
export const dataUserBusinessRules = {
    birthDate: checkMinAge,
    email: uniqueEmail,
    userName: duplicateUserName,
    passwordList: checkPassword,
    checkUpdateUser: checkUpdateUser
}