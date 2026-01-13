// ----- Componenti react-bootstrap
import { Container, Row, Col, Alert, Card, CardGroup } from "react-bootstrap";
//----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";
// ----- Componenti context
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
// ----- Stilizzazione
import "./home.css";
import "bootstrap/dist/css/bootstrap.min.css";

// ----- Home.jsx
export default function HomePage({ categoryList }) {
  const navigate = useNavigate();
    const { userData} = useContext(AuthContext);
  
  return (
    <>
      <Container>
        <Row>
          <Alert className="text-center">
            <h1>Benvenuto {userData?.userName} </h1>
            <h2>su EpicBook</h2>
          </Alert>
        </Row>

        <Row>
          <CardGroup>
            {categoryList &&
              categoryList.length > 0 &&
              categoryList.map((cat) => (
                <Card
                  key={cat}
                  onClick={() => navigate(`/books/${cat}`)}
                  className="category-card"
                >
                  <Card.Img variant="top" src="https://picsum.photos/200/400" />
                  <Card.ImgOverlay className="d-flex align-items-center justify-content-center">
                  <Card.Title 
                    className="text-black fw-bold text-center"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Card.Title>
                </Card.ImgOverlay>
                
                </Card>
              ))}
          </CardGroup>
        </Row>
      </Container>
    </>
  );
}
