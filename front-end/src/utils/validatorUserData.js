// ---- API
import { getUsersByParams, getMatchPassword } from "../service/apiUsers";

// *** CONTROLLI VALIDITA' DATI UTENTE***

// --> Controllo campo nome <--
function validateFirstName(inputFirstName) {
    if (!inputFirstName) {
        return {
            status: false,
            details: "firstName_error",
            message: "Inserisci li tuo nome",
        };
    }
    return { status: true, value: inputFirstName };
};

// --> Controllo campo cognome <--
function validateLastName(inputLastName) {
    if (!inputLastName) {
        return {
            status: false,
            details: "lastName_error",
            message: "Inserisci cognome",
        };
    }
    return { status: true, value: inputLastName };
};

// --> Controllo campo età <--
function validateAge(inputBirthdate) {
    if (!inputBirthdate) {
        return {
            status: false,
            details: "birthDate_error",
            message: "Inserisci la data di nascita",
        };
    }
    const today = new Date();

    const [year, month, day] = inputBirthdate.split("-");
    const userBirthDate = new Date(year, month - 1, day); // -1 perchè JS conta Gennaio come 0 e non come 1

    const userAge = today.getFullYear() - userBirthDate.getFullYear();
    const monthDiff = today.getMonth() - userBirthDate.getMonth();
    const dayDiff = today.getDate() - userBirthDate.getDate();

    if (userAge < 16 || //età minima per iscrizione
        (userAge === 16 && (monthDiff <= 0 && dayDiff < 0))
    ) {
        return {
            status: false,
            details: "birthDate_error",
            message: "Deve avere almeno 16 anni per porerti registrare !",
        };
    }

    return { status: true, value: inputBirthdate };
};

// --> Controllo campo email <--
async function validateEmail(inputEmail) {
    if (!inputEmail.includes("@")) {
        return {
            status: false,
            details: "InvalidEmail_error",
            message: "Inserisci una email valida",
        };
    };

    try {
        const response = await getUsersByParams({ email: inputEmail });

        // se esiste, errore
        if (response.length > 0) {
            return {
                status: false,
                details: "existedEmail_error",
                message: "Questa email è già stata registrata",
            };
        }

        //se non esiste, valido
        return { status: true, value: inputEmail };

    } catch (error) {
        return {
            status: false,
            details: "API_error",
            message: "Errore nella registrazione. Se il problema persiste contattare l'assistenza.",
        };


    };

};

// --> Controllo campi password <--
async function validatePassword(passwordData) {

    const {password1, password2, oldPassword} = passwordData;
    
    if (oldPassword) {
                const matchpassword = await getMatchPassword(oldPassword);
        if (!matchpassword.status) {
            return {
                status: false,
                details: "oldPassword_error",
                message: "Password errata.",
            }
        }
    } 

    const passwordControl =
        password1.length >= 8 &&
        /[A-Z]/.test(password1) &&
        /[0-9]/.test(password1) &&
        /[^A-Za-z0-9]/.test(password1);

    if (!passwordControl) {
        return {
            status: false,
            details: "password_error",
            message: "La password non rispetta i criteri minimi di sicurezza.",
        };
    };

    if (password1 !== password2) {
        return {
            status: false,
            details: "mismatch_password",
            message: "Le password non coincidono",
        };
    };

    return { status: true, value: password1 };
};

// --> Controllo campo userName <--
async function validateUserName(inputUserName) {
    if (!inputUserName) {
        return {
            status: false,
            details: "userName_error",
            message: "Inserisci uno username",
        };
    }
    try {

        //lista di nomi con lo stesso prefisso (es. mario , mario1, mariorossi)
        const userNameList = await getUsersByParams({ prefix: inputUserName });

        //se lunghezza 0 allora nessuna corrispondenza, username valido
        if (userNameList.length === 0) return { status: true, value: inputUserName };

        //controllo se è presente nella lista 
        const existedUsername = userNameList.some(
            (user) => user.userName.toLowerCase() === inputUserName.toLowerCase()
        );

        // se è non presente allora è valido
        if (!existedUsername) return { status: true, value: inputUserName };

        // -----> se esiste suggerisci primo username disponibile (prefisso + numero)

        const srcNumber = inputUserName.match(/(\d+)$/); //cerca gruppo di caratteri numerici alla fine

        //username senza numeri finali
        const partName = srcNumber
            ? inputUserName.slice(0, srcNumber.index)
            : inputUserName;

        //ciclo userNameList per ottenere il primo suggerimento disponibile
        for (let i = 0; i < userNameList.length; i++) {
            const suggestUserName = partName + String(i + 1);
            const trySuggest = userNameList.some(
                (user) => user.userName.toLowerCase() === suggestUserName.toLowerCase()
            );

            // se suggerimento non trovato, allora può essere suggerito
            if (!trySuggest) return {
                status: false,
                details: "userName_error",
                message: "Username già esistente. Prova con " + suggestUserName,
                value: suggestUserName,
            };

        };

    } catch (error) {
        console.error("Errore nella chiamnata API getUsernamePrefixList: ", error);
        return {
            status: false,
            details: "API_error",
            message: "Errore nella registrazione. Se il problema persiste contattare l'assistenza.",
        }

    }
};

const userDataControl = {
    firstName: validateFirstName,
    lastName: validateLastName,
    birthDate: validateAge,
    email: validateEmail,
    password: validatePassword,
    userName: validateUserName,
};

export async function validatorUserData(newData, oldData = {}) {

    //dati validati da passare ad DB
    const validatedUserData = {};
    //raggruppamento dati password per controllo
    const passwordData = {};


    //ciclo i nuovi dati, confronto con quelli vecchi e applcio i controlli
    for (const [field, value] of Object.entries(newData)) {

        //Se nuovo allora campo undefined quindi diverso da valore.
        //Se modifica allora considero dato solo se è diverso dal valore di newData e che non sia vuoto
        if (oldData[field] !== value && value) {
            

            // se è un dato password raggruppa
            if (field === "password1" || field === "password2" || field === "oldPassword") {
                passwordData[field] = value;

                //altrimenti esegui controllo
            } else {
                const resControl = await userDataControl[field](value);
                // se ok aggiungo a validatedUserData 
                if (resControl.status) {
                    validatedUserData[field] = resControl.value
                } else {
                    //altrimenti restituiscon errore
                    return resControl;
                }
            }
        }

    };

    //verifico password ( se nuovo ha due voci se è modifica ha in più oldPassword)
    const nOfPassField = Object.keys(passwordData).length;
    if (nOfPassField === 2 ||  nOfPassField ===3 ) {

        const resControl = await userDataControl["password"](passwordData);

        if (resControl.status) {
            // se ok aggiungo a validatedUserData 
            validatedUserData.password = resControl.value
        } else {
            //altimenti restituisco errore
            return resControl;
        }
        
    } else if ( nOfPassField > 0 ){
        return{
            status:false,
            details:"generic_password_error",
            message:"errore nei parametri password. Riprova"
        }
    }


    //se tutti i controlli ok, restituisci dati validati
    return {
        status: true,
        data: validatedUserData
    };
};
