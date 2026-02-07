// ----- configurazione api
import api from "./apiConfig";


// --------------------------   POST   -------------------------------------
//#region POST

// -> Nuovo utente
export const addUser = async (registerData, file) => {

    let avatar_url = "https://res.cloudinary.com/dvbmskxg4/image/upload/v1768324486/avt_default.png";
    let avatar_id = "avt_default";

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
                message: "errore caricamento file " + error
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

        await api.delete("/avatar", { params: { avatar_id: newUserData.avatar_id } })

        return {
            status: false,
            message: "errore creazione nuovo utente" + error
        };
    }

};

//#endregion

// --------------------------   PUT   -------------------------------------
//#region PUT

//-> Aggiorna User
export const putUser = async ({ avtFormData, updateUserData }) => {

    //caricamento file
    if (avtFormData) {
        try {
            const avtResponse = await api.post("/users/avatar", avtFormData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            // riassegno valori url e id
            updateUserData.avatar_url = avtResponse.data.avatar_url;
            updateUserData.avatar_id = avtResponse.data.avatar_id;
        } catch (error) {
            console.error("Errore nella chiamata API: putUser. Errore caricamento file", error);
            throw error;
        }
    };

    //aggiornamento db
    try {
        const userResponse = await api.put("/users", updateUserData);
        return userResponse.data;

    } catch (error) {
        await api.delete("/avatar", { params: { avatar_id: updateUserData.avatar_id } })

        console.error("Errore nella chiamata API: putUser. Errore aggiornameno DB", error);
        throw error;
    }

}
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

//#endregion

// --------------------------   UPDATE   --------------------------------------
//#region UPDATE

// -> Aggiorna avatar
export const updateAvatar = async (avatr) => {

}

//#endregion



