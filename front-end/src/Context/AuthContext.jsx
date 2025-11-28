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
  const [userData, setUserData] = useState(null); // stato dati utente
  const isLogged = !!token; //parametro di login

  const navigate = useNavigate();

  //al montaggio controlla presenza token
  useEffect(() => {
    const savedToken = localStorage.getItem("EpicBookToken");
    if (savedToken) setToken(savedToken);
  }, []);

  //controllo token e restituzione dati utente
  useEffect(() => {
    if (!token) {
      setUserData(null);
      return;
    }
    
    //estrapolazione dati utente
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Errore recupero dati utente:", error);
      }
    };

    fetchUserData();
  }, [token]);

  //logout: eliminazione token del localStorage
  const logout = () => {
    localStorage.removeItem("EpicBookToken");
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ setToken, isLogged, userData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
