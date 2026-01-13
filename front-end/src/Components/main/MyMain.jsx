//----- Componenti react-router-dom
import { Navigate, Routes, Route } from "react-router-dom";
// ----- Componenti context
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

//----- Componenti react-bootstrap
import { Container } from "react-bootstrap";
// ----- Stilizzazione
import "bootstrap/dist/css/bootstrap.min.css";
import "./myMain.css";

//----- Pagine
import Login from "../../Pages/Login";
import Register from "../../Pages/Register";
import User from "../../Pages/UserPage";
import HomePage from "../../pages/Home";
import Books from "../../Pages/BooksList";
import BookDetails from "../../Pages/BookDetails";
import NotFound from "../../Pages/NotFound";

// ----- MyMain.jsx
export default function MyMain({ categoryList }) {
  //recupero dal context
  const { isLogged, userData } = useContext(AuthContext);

  return (
    <Container className="mainContainer">
      
      <Routes>
      
        {/* HOME */}
        <Route path="/" element={<HomePage categoryList={categoryList} />} />
      
        {/* USER */}
        <Route path={`user/:user`} element={<User />} />
      
      {/* LOGIN: se già loggato va in user */}
        <Route
          path="login"
          element={
            !isLogged ? (
              <Login />
            ) : userData?.userName ? (
              <Navigate to={`/user/${userData.userName}`} />
            ) : null
          }
        />

        {/* REGISTER: se già loggato va in user  */}
        <Route
          path="register"
          // se già loggato vai al profile
          element={
            !isLogged ? (
              <Register />
            ) : (
              <Navigate to={"/"} />
            ) 
          }
        />

        {/* BOOKS: libri per categoia */}
        <Route path="books/:category" element={<Books />} />
        
        {/* DETAILS: dettagli libro */}
        <Route
          path="details/:asin"
          element={
            <BookDetails />
          }
        />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      
      </Routes>
    </Container>
  );
}
