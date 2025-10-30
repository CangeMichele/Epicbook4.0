//----- Componenti react
import { React, useEffect, useState } from "react";
//----- Componenti react-router-dom
import { useParams } from "react-router-dom";
//----- Componenti react-bootstrap
import { Row, Col, Card } from "react-bootstrap";
//----- Componenti App
import CommentsArea from "../Components/comments_area/CommentsArea";
// ----- API
import { getBook } from "../service/apiBooks";


/*** pagina libro specifico  ***/
export default function BookDetailes() {
  //recupero asi da url
  const { asin } = useParams();
  //stato libro caricato
  const [bookDetails, setBookDetails] = useState({});

  //estrazione libro da db tramise asin
  useEffect(()=>{
    const fetchBook = async() =>{
      try {
        const book = await getBook(asin);
        console.log(book);
        setBookDetails(book);

      } catch (error) {
        console.error("Errore estrazione libro", error);
        
      }
    };
    fetchBook();
  },[asin])


  return (
    <>
       <Row>
       <Col>
    {Object.keys(bookDetails).length > 0 ? (
                <Card className="mb-3" style={{ maxWidth: "540px" }}>
                <Row className="g-0">
                  <Col md={4}>
                    <Card.Img
                      src={bookDetails.img}
                      className="img-fluid rounded-start"
                      alt="..."
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>{bookDetails.title}</Card.Title>
                      <Card.Text className="mt-5">
                        <p><b>Prezzo: </b>€{bookDetails.price}</p>
                        <p><b>Ctegoria: </b>{bookDetails.category}</p>
                      </Card.Text>
                      <Card.Text>
                        <small className="text-body-secondary">
                        asin: {asin}
                        </small>
                      </Card.Text>
                      
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
              ) : (
                <p>ERRORE CARICAMENTO</p>
              )}

          
        </Col>
 
        <Col>
          <CommentsArea asin={asin} />
        </Col>
      </Row>
    </>
  );
}
