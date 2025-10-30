//----- Componenti react
import { React, useEffect, useState } from "react";
//----- Componenti react-rpouter-dom
import { useParams } from "react-router-dom";
// ----- API
import { getBooksCategory } from "../service/apiBooks";
//----- Componenti react-bootstrap
import { Row, Col } from "react-bootstrap";

// ----- Componenti app
import SingleBook from "../Components/book/SingleBook";


//*** popola la pagina con le anteprime dei libri estratti per categoria dal DB ***/
function BooksList() {
  //recupero categoria da url
  const { category } = useParams();
  //stato libri caricati
  const [books, setBooks] = useState([]);

  //estrazione libri nel db per categoria
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksResult = await getBooksCategory(category);
        setBooks(booksResult);
      } catch (error) {
        console.error("errore richiesta libri categoria", error);
      }
    };
    fetchBooks();
  }, [category]);

  return (
    <Row>
      <Col>
        <Row>
          {books.length > 0 ? (
            books.map((book) => <SingleBook key={book.asin} bookData={book} />)
          ) : (
            <p>ERRORE CARICAMENTO</p>
          )}
        </Row>
      </Col>
    </Row>
  );
}

export default BooksList;
