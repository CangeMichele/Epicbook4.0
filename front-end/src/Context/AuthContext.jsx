//----- Componenti react
import { createContext, useEffect, useState } from "react";
// ----- API
import { getAuthUser } from "../api/apiAuth.js";
//----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";

// contesto di autenticazione
export const AuthContext = createContext();

// *** CONTEXT DI GESTIONE TOKEN E DATI UTENTE LOGGATO  ***
export const AuthProvider = ({ children }) => {
  
  // stato contenente token
  const [token, setToken] = useState(null); 
  
  // stato dati utente
  const [userLogged, setUserLogged] = useState(null); 

  //stato caricamento dati utente
  const [userDataLoading, setUserDataLoading] = useState(true); 

  //parametro di login
  const isLogged = !!token; 

  const navigate = useNavigate();

  //recupero token in localStorage se presente
  useEffect(() => {
    const savedToken = localStorage.getItem("EpicBookToken");
    if (savedToken) setToken(savedToken); //
  }, []);

  // recupero dati utente
  useEffect(() => { 

    // se non c'è token blocca
    if (!token) {
      return;
    }
    
    //estrapolazione dati utente
    const fetchUserData = async () => {
      try {      
        const data = await getAuthUser();
        //coversione birthDate da formato DB a front-end
        const formattedDate = data.birthDate.slice(0, 9);
        //caricamento user
        const {birthDate, ...rest} = data;
        setUserLogged({
          ...rest,
          birthDate: formattedDate
        });
        
      } catch (error) {
        
        // se token scaduto/non valido fai logout
        if (error.response.status == 401) {
          logout();
          return;
        }
        console.error("Errore recupero dati utente:", error);
      } finally {
        // fine caricamento
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  //reset dati autenticazione
  const resetAuth = () => {
    localStorage.removeItem("EpicBookToken");
    setToken(null);
    setUserLogged(null);
  };

  //logout: reset parametri
  const logout = () => {
    resetAuth();
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        setToken,
        isLogged,
        userLogged,
        setUserLogged,
        logout,
        userDataLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
