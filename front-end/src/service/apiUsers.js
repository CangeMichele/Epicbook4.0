// ----- configurazione api
import api from "./apiConfig";


// --------------------------   POST   -------------------------------------
//#region POST

// -> Nuovo utente
export const addUser = async (registerFormData) => {
    try {
        const response = await api.post(`/users`, registerFormData);
        return response.data;
    } catch (error) {
        console.error("Errore nella chiamata api: addUser", error)
        throw error;
    };
};

//#endregion



// --------------------------   GET   --------------------------------------
//#region GET

// -> Tutti gli utenti
export const getAllUsers = async () => {
    try {
        const response = await api.get("/users");
        return response.data
    } catch (error) {
        console.error("Errore nella chiamata api: getAllUser", error)
        throw error;
    }
};

//  -> Utente da email
export const getByUserEmail = async (email) => {
    try {
        const response = await api.get(`/users/email/${encodeURIComponent(email)}`);
        // endcodeURIComponent per evitare crash su caratteri speciali
        return response.data;
    } catch (error) {
        console.error("Errore nella chiamata api: getByUserEmail", error);
        throw error;
    }
};


// -> Utente da username
export const getByUsername = async (username) => {
    try {
        const response = api.get(`/users/${username}`);

        return (await response).data;
    } catch (error) {
        console.error("Errore nella chiamata api: getByUsername", error);
        throw error;
    }
};


// -> Lista di username con prefisso uguale (es. mario, mario3, mariorossi)
export const getUsernamePrefixList = async (newUsername) => {
    try {
        const response = await api.get(`/users/usernamePrefix/${newUsername}`);
        return response.data;
    } catch (error) {
        console.error("Errore nella richiesta API:getUsernamePrefixList", error);
        throw error;
    }
};
//#endregion

// --------------------------   UPDATE   --------------------------------------
//#region UPDATE

export const updateUserAvatar = async (newAvatar)  =>
//#endregion



