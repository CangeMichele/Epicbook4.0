// *** VALIDAZIONE PER CAMPI DI USER ***

//--- validatori base
import {
    stringValidator,
    integerNumberValidator,
    dateValidator,
    emailValidator,
    newPasswordValidator
} from "../baseValidator.js";

//--- utilità 
import { utils } from "../baseValidator.js";


// -------------------- CAMPI DA VALIDARE --------------------

//--> Controllo per campo firstName
function validateFirstName(firstName) {
    const transforms = [utils.capitalizeWords];
    //verifico input
    const result = stringValidator(
        "firstName",
        firstName,
        transforms
    )
    return result
};

//--> Controllo per campo lastName
function validateLasttName(lastName) {
    const transforms = [utils.capitalizeWords];
    //verifico input
    const result = stringValidator(
        "lastName",
        lastName,
        transforms
    )
    return result
};

//--> Controllo per campo birthdate
function validateBirthDate(birthdate) {
    const result = dateValidator("birthdate", birthdate);
    return result;
};

//-->  Controllo campo email
function validateEmail(email) {
    //verifico input
    const result = emailValidator("email", email);
    return result;
};

//--> Controllo sui campi password
function validatePasswordList(passwordList) {
    //regole sicurezza password
    const rules = [
        { name: "min_length", fn: v => v.length >= 8 },
        { name: "uppercase", fn: v => /[A-Z]/.test(v) },
        { name: "lowercase", fn: v => /[a-z]/.test(v) },
        { name: "number", fn: v => /[0-9]/.test(v) },
        { name: "symbol", fn: v => /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`]+/.test(v) }
    ];

    //verifica validità nuova password
    console.log("passwordLIst", passwordList);
    
    const newPasswords = passwordList.newPasswords;
    const reference = newPasswords[0];

    const resNew = newPasswordValidator(reference, rules);
    if (!("value" in resNew)) return resNew;
    //sostituzione con dato validato
    newPasswords[0] = resNew.value;

    //controllo vecchia password (se presente)
    let oldPassword = passwordList.oldPassword;
    let resOld = {};
    if (oldPassword) {
        resOld = stringValidator(
            "oldPassword",
            oldPassword,
            []
        );
        if (!("value" in resOld)) return resOld;
    }
    //sostituzione con dato validato
    oldPassword = resOld.value;

    //restituisci valori puliti
    return {
        value: {
            newPasswords,
            oldPassword
        }
    }

};

//--> Controllo campo userName
function validateUserName(userName) {
    const transforms = [];
    //verifico input
    const result = stringValidator(
        "userName",
        userName,
        transforms
    )
    return result
};

// --> Controllo campo user_id
function validateUser_id(user_id) {
    const transforms = [];
    //verifico input
    const result = stringValidator(
        user_id,
        "user_id",
        transforms
    )
    return result;
};

// --> Controllo campo avatar_id
function validateAvatar_id(avatar_id) {
    const transforms = [];
    //verifico input
    const result = stringValidator(
        "avatar_id",
        avatar_id,
        transforms
    )
    return result;
};

// --> Controllo campo avatr_url
function validateAvatar_url(avatar_url) {
    const transforms = [];
    //verifico input
    const result = stringValidator(
        "avatar_url",
        avatar_url,
        transforms
    )
    return result;
};

// --------------------------   EXPORT WRAPPER   --------------------------------------

export const userDataValidators = {
    firstName: validateFirstName,
    lastName: validateLasttName,
    birthDate: validateBirthDate,
    email: validateEmail,
    passwordList: validatePasswordList,
    userName: validateUserName,
    user_id: validateUser_id,
    avatar_id: validateAvatar_id,
    avatar_url: validateAvatar_url
};
