
//----- Comonenti react-router-dom
import { BrowserRouter as Router} from "react-router-dom";
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
      <Router>
      
        <AuthProvider>
          <MyNavbar categoryList={categoryList} />
          <MyMain categoryList={categoryList} />
        </AuthProvider>

        <MyFooter />
      </Router>
    </>
  );
}
