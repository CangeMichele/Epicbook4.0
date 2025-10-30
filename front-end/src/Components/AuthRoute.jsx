//----- Componenti react
import { React, useContext } from "react";
//----- Componenti react-router-dom
import { Navigate } from "react-router-dom";
//----- Componenti context
import { AuthContext } from "../Context/AuthContext";

export default function AuthRoute({ children }) {
  //recupero valore controllo token
  const { isAuth } = useContext(AuthContext);

  // se autenticato naviga, altrimenti pagina login
  return isAuth ? children : <Navigate to="/login" />;
};
