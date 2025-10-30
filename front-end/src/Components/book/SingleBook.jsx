//----- Componenti react
import { React } from "react";
//----- Componenti react-bootstrap
import { Card, Col, Button } from "react-bootstrap";
//----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";

// ----- Stilizzazione
import "./SingleBook.css";


/*** genera anteprima del libro ***/
export default function SingleBook({ bookData }) {
  const navigate = useNavigate();

  return (
    <Col>
      <Card className="my-card">
        <Card.Img
          variant="top"
          alt={`copertina ${bookData.asin}`}
          src={bookData.img}
        />
        <Card.Body>
          <Card.Title className="my-card-title">{bookData.title}</Card.Title>
          <Button
            className="w-100 my-2"
            onClick={() => navigate(`/details/${bookData.asin}`)}
          >
            Dettagli
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}
