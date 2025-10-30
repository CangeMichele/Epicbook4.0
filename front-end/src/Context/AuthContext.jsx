//----- Componenti react
import { React, createContext, useEffect, useState } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);
    
    //estrazione token  dal localStorage (se presente)
    useEffect(()=>{
        const storedToken = localStorage.getItem("EpBoUserToken");
        if(storedToken) setToken(storedToken);
    },[]);

    //login: popola localStorage con token
    const login = (newToken) =>{
        localStorage.setItem("EpBoUserToken", newToken);
        setToken(newToken);
    };

    //logout: eliminazione token del localStorage
    const logout = ()=>{
        localStorage.removeItem("EpBoUserToken");
        setToken(null);
    };

    //costante di controllo autenticazione
    const isAuth = !!token;

  return (
    <AuthContext.Provider value={{token, login, logout, isAuth}}>
        {children}
    </AuthContext.Provider>
  )
};
