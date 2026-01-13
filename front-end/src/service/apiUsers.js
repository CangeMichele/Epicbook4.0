// ----- configurazione api
import api from "./apiConfig";


// --------------------------   POST   -------------------------------------
//#region POST

// -> Nuovo utente
export const addUser = async (registerFormData) => {

    const response = await api.post(`/users`, registerFormData);
    return response.data;

};

//#endregion

// --------------------------   PUT   -------------------------------------
//#region PUT

//-> Aggiorna User
export const putUser = async (uploadFormData) => {
    const response = await api.put(`/users/avatar`, uploadFormData);
    return response.data;

}
//#endregion



// --------------------------   GET   --------------------------------------
//#region GET

// -> Tutti gli utenti
export const getAllUsers = async () => {

    const response = await api.get("/users");
    return response.data

};

//  -> Utente da email
export const getByUserEmail = async (email) => {

    const response = await api.get(`/users/email/${encodeURIComponent(email)}`);
    // endcodeURIComponent per evitare crash su caratteri speciali
    return response.data;

};


// -> Utente da username
export const getByUsername = async (username) => {

    const response = await api.get(`/users/${username}`);

    return response.data;

};


// -> Lista di username con prefisso uguale (es. mario, mario3, mariorossi)
export const getUsernamePrefixList = async (newUsername) => {

    const response = await api.get(`/users/usernamePrefix/${newUsername}`);
    return response.data;

};
//#endregion

// --------------------------   UPDATE   --------------------------------------
//#region UPDATE

// -> Aggiorna avatar
export const updateAvatar = async (avatr) => {

}

//#endregion



