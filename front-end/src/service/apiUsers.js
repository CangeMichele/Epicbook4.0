// ----- configurazione api
import api from "./apiConfig";


// --------------------------   POST   -------------------------------------
//#region POST

// -> Nuovo utente
export const addUser = async (registerFormData, file) => {


    //se non presente file uso default
    if (!file) {
        registerFormData.append("avatar_url",
            "https://res.cloudinary.com/dvbmskxg4/image/upload/v1768324486/avt_default.png");
        registerFormData.append("avatar_id", "avt_default");


        //altrimenti carico su cloudinary
    } else {
        const addAvatar = new FormData();
        addAvatar.append("avatar", file);

        const responseAvtar = await api.post("/avatar", addAvatar,
            {
                headers: { "Content-Type": "multipart/form-data" }
            }
        );

        if (responseAvtar.status === 200) {
            registerFormData.append("avatar_url", responseAvtar.data.avatar_url);
            registerFormData.append("avatar_id", responseAvtar.data.avatar_id);
        } else {
            return {
                status: false,
                message: "errore caricamento file "
            };
        };
    }

    // crezione nuovo utente sul DB
    const responseUser = await api.post("/users", registerFormData);
    if (responseUser.status === 200) {
        return { status: true ,
            token:responseUser.token 
        };
    } else {
        return { status: false, message:"errore creazione nuovo utente"};
    }


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

//  -> esistenza utente da email
export const getExistedUserByEmail = async (email) => {

    const response = await api.get(`/users/existedEmail/${encodeURIComponent(email)}`);
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



