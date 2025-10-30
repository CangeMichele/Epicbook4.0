//----- Componenti react
import React from "react";
//----- Componenti react-router-dom
import { Routes, Route } from "react-router-dom";

//----- Componenti
import ToTop from "../ToTop";

//----- Componenti react-bootstrap
import { Container } from "react-bootstrap";
// ----- Stilizzazione
import "bootstrap/dist/css/bootstrap.min.css";
import "./myMain.css";

//----- Pagine
import Login from "../../Pages/Login";
import Register from "../../Pages/Register";
import HomePage from "../../pages/Home";
import Books from "../../Pages/BooksList";
import BookDetails from "../../Pages/BookDetails";
import NotFound from "../../Pages/NotFound";
import AuthRoute from "../AuthRoute";

// ----- MyMain.jsx
export default function MyMain({ categoryList }) {
  return (
    <Container className="mainContainer">
      <ToTop />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="/" element={<HomePage categoryList={categoryList} />} />

        <Route path="books/:category" element={<Books />} />

        <Route
          path="details/:asin"
          element={
              <BookDetails />
            // <AuthRoute>
            // </AuthRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
  );
}
