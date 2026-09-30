// ----- configurazione api
import api from "./apiConfig";


// -------------------   Assegnazione tOKEN   --------------------------------
//#region Login

// -> Login utente, assegnazione token
export const loginUser = async (credetials) => {
    console.log("credetials: ", credetials);
    
    try {
        const response = await api.post("/auth/login", credetials);
        
        return response.data;
        
    } catch (error) {
        console.log("API LOGIN error: ", error);
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
    }t

};
//#endregion
