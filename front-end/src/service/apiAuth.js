// ----- configurazione api
import api from "./apiConfig";


// -------------------   Assegnazione tOKEN   --------------------------------
//#region Login

// -> Login utente, assegnazione token
export const loginUser = async (credetials) => {
    try {
        const response = await api.post("/auth/login", credetials);
        console.log(response.data);
        return response.data;
        
    } catch (error) {
        throw error;
    }
};
//#endregion


// ------------------------   USER DATA   ------------------------------------
//#region UserData

// -> Estrapolazione dati etente loggato
export const getUserData = async () => {
    try {
        const response = await api.get("auth/me");
        return response.data;

    } catch (error) {
 
        console.error("Errore nella richiesta getUserData:", error);
        throw error;
    }

};
//#endregion
