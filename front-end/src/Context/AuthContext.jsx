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

  // recupero dati utente
  useEffect(() => {

    if (!token) {
      //recupero token dal localStorage
      const savedToken = localStorage.getItem("EpicBookToken");
      //se token assente interrompi
      if (!savedToken) return;
      
      //sava token
      setToken(savedToken);
    }

    //estrapolazione dati utente
    const fetchUserData = async () => {
      try {
        const data = await getAuthUser();
        //coversione birthDate da formato DB a front-end
        const formattedDate = data.birthDate.slice(0, 10);
        //caricamento user
        const { birthDate, ...rest } = data;
        setUserLogged({
          ...rest,
          birthDate: formattedDate,
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
  }, [token, userLogged]);

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
        token,
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
