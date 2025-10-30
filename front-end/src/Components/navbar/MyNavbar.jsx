//----- Componenti react
import React, { useEffect, useState } from "react";
//----- Componenti react-router-dom
import { useLocation, useParams } from "react-router-dom";
//-----Componenti react-router-bootstrap
import { LinkContainer } from "react-router-bootstrap";
//----- Componenti react-bootstrap
import { Container, Nav, Navbar } from "react-bootstrap";

// ----- Stilizzazione
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyNavbar.css";

//----- MyNavbar.jsx
export default function MyNavbar({ categoryList }) {
  //recupero categoria da url
  const {category} = useParams();
  //rilevo cambio url
  const location = useLocation();
  //stato categoria attiva
  const [activeCat, setActiveCat] = useState("");

  //recupero categoria ad ogni cambio url 
  useEffect(() => {
    const pathParts = location.pathname.split("/"); 
    const categoryFromPath = pathParts[2] || "";     
    
    setActiveCat(categoryFromPath);
  }, [location]);

  return (
    <Navbar expand="lg" className="bg-body-tertiary fixed-top">
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
              <LinkContainer key={cat} to={`/books/${cat}`}>
                <Nav.Link className={cat === activeCat ? "active-nav" : ""}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Nav.Link>
              </LinkContainer>
            ))}
          </Nav>

          <Nav >
            <LinkContainer to="/login">
              <Nav.Link>Accedi</Nav.Link>
            </LinkContainer>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
