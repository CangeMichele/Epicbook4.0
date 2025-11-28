//----- Componenti react-router-dom
import { Routes, Route } from "react-router-dom";
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
    //recupero token dal context
    const { token } = useContext(AuthContext);

  return (
    <Container className="mainContainer">
      <Routes>
        <Route path="/" element={<HomePage categoryList={categoryList} />} />
        <Route path="login" element={<Login />} />
        <Route path="user/:username" element={<User />} />
        {/* se login non può registrarsi */}
        <Route path="register" element={!token?<Register />: <Navigate to="/" />} />


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
