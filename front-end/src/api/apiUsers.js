// ----- configurazione api
import api from "./apiConfig";


// --------------------------   POST   -------------------------------------
//#region POST

// -> Nuovo utente
export const addUser = async (registerData, file) => {

    const formData = new FormData();

    for (const [key, val] of Object.entries(registerData)) {
        formData.append(key, val);
    }
    if (file) formData.append("avatar", file);

    try {
        const userResponse = await api.post("/users", formData);
        return userResponse.data;

    } catch (error) {

        return error.response?.data;
    }

};

//#endregion

// --------------------------   GET   --------------------------------------
//#region GET

// -> Utenti con parametri
export const getUsersByParams = async (params = {}) => {
    try {

        const response = await api.get("/users", { params });
        return response.data;

    } catch (error) {
        return error.response?.data;
    }
};

// -> Controllo password
export const getMatchPassword = async (oldPassword) => {
    try {

        const response = await api.get("/users/me/check-password", { params: { password: oldPassword } });
        return response.data;

    } catch (error) {
        console.error("errore nella chiamata API: getMatchPassword", error);
        throw error;
    }
}

//#endregion

// --------------------------   PUT   -------------------------------------
//#region PUT

//-> Aggiorna Avatar
export const putAvatar = async ({ avtFormData }) => {
    const user_id = avtFormData.get("user_id");
    console.log("user_id = " + user_id);

    if (!avtFormData || !user_id)
        return console.error("Errore nella chiamata API: putAvatar. Dati insufficenti")

    try {
        const response = await api.put(`/users/me/avatar`, avtFormData);
        return response;

    } catch (error) {
        console.error("Errore nella chiamata API: getUsersByParams", error);
        throw error;
    }
}

// -> Aggiorna dati user
export const editUser = async (dataEdit) => {

    try {
        const response = await api.put(`/users/me`, dataEdit);
        
        return response.data;
        
    } catch (error) {
        return error.response?.data;
    }
}

//#endregion


