import axios from "axios";

// ----- Configurazione endpoint axios 
const API_URL = "http://localhost:5000/api";
const api = axios.create({
  baseURL: API_URL,
});

// ----- Aggiunge token nell header (se presente il localStorage)
api.interceptors.request.use(
    (config) => {
      // Recupera il token dalla memoria locale
      const token = localStorage.getItem("EpicBookToken");
      if (token) {
        // Se il token esiste, aggiungilo all'header di autorizzazione
        config.headers.authorization = `Bearer ${token}`;
        console.log("Token inviato:", token); 
      }
      return config; 
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// ----- Logout se token scaduto/mancante/non valido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.respomnse?.status === 401) { //401 = unathorized
      //rimozione token
      localStorage.removeItem("EpicBookToken");
      //navigazione a login
      window.location.href="/login";
    }
    return Promise.reject(error);
  }

) 

export default api;