// ----- configurazione api
import api from "./apiConfig";


// --------------------------   POST   -------------------------------------
//#region POST

// -> Nuovo utente
export const addUser = async (registerData, file) => {

    let avatar_url = "https://res.cloudinary.com/dvbmskxg4/image/upload/v1772792679/epicbook/avatar/avt_default.png";
    let avatar_id = "epicbook/avatar/avt_default";

    //se file presente carico su cloudinary
    if (file) {
        try {
            const avtFormData = new FormData();
            avtFormData.append("avatar", file);

            const avtResponse = await api.post("/users/avatar", avtFormData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            // riassegno valori url e id
            avatar_url = avtResponse.data.avatar_url;
            avatar_id = avtResponse.data.avatar_id;

        } catch (error) {
            return {
                status: false,
                message: "errore caricamento file " + error.message
            };
        }
    }

    // crezione nuovo utente sul DB
    const newUserData = { ...registerData, avatar_id, avatar_url };
    try {
        const userResponse = await api.post("/users", newUserData);

        return {
            status: true,
            token: userResponse.data.token
        };

    } catch (error) {

        if (avatar_id !== "avt_default") {
            try {
                await api.delete("/avatar", { params: { avatar_id } });
            } catch (cleanupError) {
                console.error("Errore cleanup Cloudinary:", cleanupError);
            }
        }
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
        console.error("Errore nella chiamata API: getUsersByParams", error);
        throw error;
    }
};

// -> Controllo password
export const getMatchPassword = async (oldPassword) => {    
    try {
        
        const response = await api.get("/users/me", { params: { password: oldPassword } });        
        return response.data;

    } catch (error) {
        console.log("errore");
        
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
export const putUserData = async (updateData) => {
    console.log("questo è updateUserData", updateData);

    if (!updateData) return console.error("Errore nella chiamata API: putUserData: nessun dato presente");

    try {
        const response = await api.put(`/users/me`, updateData);
        return response;
    } catch (error) {
        console.error("Errore nella chiamata API: putUserData", error);
        throw error;
    }
}

//#endregion


