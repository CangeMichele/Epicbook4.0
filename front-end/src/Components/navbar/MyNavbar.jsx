//----- Componenti react
import { useEffect, useState } from "react";
//----- Componenti react-router-dom
import { useLocation } from "react-router-dom";
//-----Componenti react-router-bootstrap
import { LinkContainer } from "react-router-bootstrap";
//----- Componenti react-bootstrap
import { Container, Nav, Navbar, Button,NavDropdown  } from "react-bootstrap";
// ----- Componenti context
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
// ----- API

// ----- Stilizzazione
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyNavbar.css";

//----- MyNavbar.jsx
export default function MyNavbar({ categoryList }) {

  //stringa url attuale (lavoro su url perchè navbar è furi dalle rotte e quindi non posso usare useParams)
  const url = useLocation();
  //stato categoria selezionata
  const [selectedCategory, setSelectedCategory] = useState("");

  // recupero dal context
  const { isLogged, logout, userData } = useContext(AuthContext);
  
  
  useEffect(() => {
    //controllo se mi trovo in /books  
    if (url.pathname.split("/")[1] === "books"){
      //recupero categoria
      setSelectedCategory( url.pathname.split("/")[2])
    }
  }, [url]);

  return (
    <Navbar expand="lg" className="bg-body-tertiary fixed-top" collapseOnSelect>
      <Container>
        <Navbar.Brand>EpicBook!</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link className="mr-2">Home</Nav.Link>
            </LinkContainer>
          </Nav>

          <Nav className="me-5">
            {categoryList?.map((category) => (
              <LinkContainer key={category} to={`/books/${category}`}>
                <Nav.Link className={category === selectedCategory ? "active-nav" : ""}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Nav.Link>
              </LinkContainer>
            ))}
          </Nav>

          <Nav>
            {isLogged && userData ?
            (
              <NavDropdown title={userData?.firstName || "Utente"} id="basic-nav-dropdown">
              <NavDropdown.Item href={`/user/${userData.userName}`}>Profilo</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                              <Button onClick={logout}>logout</Button>
              </NavDropdown.Item>
            </NavDropdown>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>Accedi</Nav.Link>
              </LinkContainer>
            ) }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
