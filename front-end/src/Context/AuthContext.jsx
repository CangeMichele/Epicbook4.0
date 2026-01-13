//----- Componenti react
import { createContext, useEffect, useState } from "react";
// ----- API
import { getUserData } from "../service/apiAuth";
//----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";

// contesto di autenticazione
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 
  const [token, setToken] = useState(null); // stato contenente token
  const isLogged = !!token; //parametro di login
  const [userData, setUserData] = useState(null); // stato dati utente
  const[userDataLoading, setUserDataLoading] = useState(true)//stato caricamento dati utente

  const navigate = useNavigate();


   useEffect(() => {
    //recupero token in localStorage se presente
    const savedToken = localStorage.getItem("EpicBookToken");
    if (savedToken) setToken(savedToken); //
    
    // se non c'è in localStorage e non è stato settato dal login allora blocca tutto
    if (!token) {
      return;
    }
    
    // se non si è bloccato allora token preso da login

     //estrapolazione dati utente
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        // se token scaduto/non valido fai logout
        if (error.status == 401){
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
    setUserData(null);
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
        userData,
        logout,
        userDataLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
