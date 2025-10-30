//----- Componenti react
import { React } from "react";
//----- Comonenti react-router-dom
import { BrowserRouter } from "react-router-dom";
//----- Componenti context
import { AuthProvider } from "./Context/AuthContext";

//----- Componenti app
import MyNavbar from "./Components/navbar/MyNavbar";
import MyMain from "./Components/main/MyMain";
import MyFooter from "./Components/footer/MyFooter";

// ----- Stilizzazione
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

//----- App.js -----
export default function App() {
  //lista categorie
  const categoryList = ["fantasy", "history", "horror", "romance", "scifi"];

  return (
    <>
      <BrowserRouter>
        <MyNavbar categoryList={categoryList} />
  
        <AuthProvider>
          <MyMain categoryList={categoryList} />
        </AuthProvider>
  
        <MyFooter />
      </BrowserRouter>
    </>
  );
}
