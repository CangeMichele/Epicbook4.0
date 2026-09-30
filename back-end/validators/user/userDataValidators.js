// *** VALIDAZIONE PER CAMPI DI USER ***

//--- validatori base
import {
    stringValidator,
    integerNumberValidator,
    dateValidator,
    emailValidator,
    rulesValidator
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
function validateBirthDate(birthDate) {
    const result = dateValidator("birthDate", birthDate);
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

    console.log("passwordLis:", passwordList);
    
    let {newPasswords, oldPassword} = passwordList;
    //regole sicurezza password
    const rules = [
        { name: "min_length", fn: v => v.length >= 8 },
        { name: "uppercase", fn: v => /[A-Z]/.test(v) },
        { name: "lowercase", fn: v => /[a-z]/.test(v) },
        { name: "number", fn: v => /[0-9]/.test(v) },
        { name: "symbol", fn: v => /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`]+/.test(v) }
    ];

    //verifica validità nuova password   
    const reference = newPasswords[0];
    const testNew = rulesValidator("password", reference, rules);
    if (!("value" in testNew)) return testNew;

    //sostituzione con dato validato
    newPasswords[0] = testNew.value;

    //controllo vecchia password (se presente)
    let testOld = {};
    if (oldPassword) {
        testOld = stringValidator(
            "oldPassword",
            oldPassword,
            []
        );
        if (!("value" in testOld)) return testOld;
    }
    //sostituzione con dato validato
    oldPassword = testOld.value;

    //restituisci valori puliti
    return {
        value: {
            newPasswords,
            ...(oldPassword ? oldPassword : {})
        }
    }

};

//--> Controllo campo userName
function validateUserName(userName) {
    //regole caratteri ammessi
    const rules = [
        { name: "min_length", fn: v => v.length >= 3 },
        { name: "max_length", fn: v => v.length <= 30 },
        { name: "allowed_characters", fn: v => /^[A-Za-z0-9_-]+$/.test(v) }
    ];
    //verifica validità userName   
    const result = rulesValidator("userName", userName, rules);
    return result
};

// --> Controllo campo _id
function validateUser_id(_id) {
    //verifico input
    const result = stringValidator("_id", _id)
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
    _id: validateUser_id,
    avatar_id: validateAvatar_id,
    avatar_url: validateAvatar_url
};
