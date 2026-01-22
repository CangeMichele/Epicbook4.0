//----- Comonenti react-router-dom
import { BrowserRouter as Router } from "react-router-dom";
//----- Componenti context
import { AuthProvider } from "./Context/AuthContext";
import { BooksContext, BooksProvider } from "./Context/BooksContext";

//----- Componenti app
import MyNavbar from "./Components/navbar/MyNavbar";
import MyMain from "./Components/main/MyMain";
import MyFooter from "./Components/footer/MyFooter";

// ----- Stilizzazione
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

//----- App.js -----
export default function App() {
  return (
    <>
      <Router>
        
        <AuthProvider> {/* wrapper autenticazione: context dati utente */}
          
          <BooksProvider> {/* context dati libri */}
            <MyNavbar />
            <MyMain />
          </BooksProvider>

        </AuthProvider>

        <MyFooter />
      </Router>
    </>
  );
}
