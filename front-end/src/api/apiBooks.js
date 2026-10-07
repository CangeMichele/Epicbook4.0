// ----- Configurazione api 
import api from "./apiConfig";


// --------------------------   GET   -------------------------------------
//#region GET        

// -> Libri con parametri
export const getBooksByParams = async (params = {}) => {
    try {

        const response = await api.get("/books", { params });
        return response.data;

    } catch (error) {
        return error.response?.data;
    }
};

//#endregion 