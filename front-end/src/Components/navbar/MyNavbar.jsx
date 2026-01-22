//-----Componenti react-router-bootstrap
import { LinkContainer } from "react-router-bootstrap";
//----- Componenti react-bootstrap
import { Container, Nav, Navbar, Button, NavDropdown } from "react-bootstrap";
// ----- Componenti context
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { BooksContext } from "../../Context/BooksContext";
// ----- API

// ----- Stilizzazione
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyNavbar.css";

//----- MyNavbar.jsx
export default function MyNavbar() {
  const { categoryList, category, setCategory } = useContext(BooksContext);

  // recupero dal context
  const { isLogged, logout, userData } = useContext(AuthContext);

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
            {categoryList?.map((cat) => (
              <Nav.Link
                key={cat}
                onClick={()=>setCategory(cat)}
                className={cat === category ? "active-nav" : ""}
                style={{ cursor: "pointer" }} 
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Nav.Link>
            ))}
          </Nav>

          <Nav>
            {isLogged && userData ? (
              <NavDropdown
                title={userData?.firstName || "Utente"}
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href={`/user/${userData.userName}`}>
                  Profilo
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Button onClick={logout}>logout</Button>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>Accedi</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
