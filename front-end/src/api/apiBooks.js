// ----- Configurazione api 
import api from "./apiConfig";


// --------------------------   GET   -------------------------------------
//#region GET        

// -> Libri per parametro filtri con impaginazione
export const getBooksByFilter = async (params = {}) => {
    try {
        const response = await api.get("/books", { params });
        return response.data;
        
    } catch (error) {
        console.error("Errore nella chiamata API: getBooksByFilter", error);
        throw error;
    }
};

// -> Libro per asin
export const getBook = async (asin) => {
    try {
        const response = await api.get(`books/details/${asin}`)
        return response.data;
    } catch (error) {
        console.error("Errore nella richiesta API: getBook", error)
        throw error;
    }
}
//#endregion 