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
export const getAuthUser = async () => {
    try {
        const response = await api.get("auth/me");
        return response.data;

    } catch (error) {
 
        console.error("Errore nella richiesta getAuthUser:", error);
        throw error;
    }

};
//#endregion
