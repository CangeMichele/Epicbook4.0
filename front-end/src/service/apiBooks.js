// ----- Configurazione api 
import api from "./apiConfig";

//GET => Tutti i libri
export const getAllBooks = async ()=>{
    try {
        const response = await api.get("/books");
        return response.data
    } catch (error) {
        console.error("Errore nella chiamata API: getAllBooks", error);
        throw error;
    }
};

//GET => Libri per categoria
export const getBooksCategory = async (category)=>{
    try {
        const response = await api.get(`/books/${category}`);
        return response.data;
    } catch (error) {
        console.error("Errore nella chiamata API: getBooksCategory", error);
        throw error;
    }
};

//GET => Libro per asin
export const getBook = async(asin) =>{
    try {
        const response = await api.get(`books/details/${asin}`)
        return response.data;
    } catch (error) {
        console.error("Errore nella richiesta API: getBook", error)
        throw error;
    }
}