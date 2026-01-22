//----- Componenti react
import { useEffect, useState } from "react";
//----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";
// ----- Componenti context
import { useContext } from "react";
import { BooksContext } from "../Context/BooksContext";
// ----- API
import { getBooksByFilter } from "../service/apiBooks";
//----- Componenti react-bootstrap
import { Row, Col, Button, Form } from "react-bootstrap";

// ----- Componenti app
import SingleBook from "../Components/book/SingleBook";

//*** popola la pagina con le anteprime dei libri estratti per categoria dal DB ***/
function BooksList() {
  //recupero categoria dal context
  const { category } = useContext(BooksContext);

  //stato libri caricati
  const [books, setBooks] = useState([]);

  //stati elementi per impaginazione
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  //navigatore
  const navigate = useNavigate();

  //se non c'è categoria allora ritona in home
  useEffect(() => {
    if (!category) navigate("/");
  }, [category]);

  //estrazione libri nel db per categoria
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksResult = await getBooksByFilter({
          category: category,
          page: currentPage,
          limit: limit,
        });

        setBooks(booksResult.books);
        setTotalPages(booksResult.totalPages);
      } catch (error) {
        console.error("errore richiesta libri categoria", error);
        setBooks([]);
      }
    };

    fetchBooks();
  }, [category, currentPage, limit]);

  console.log("books state:", books);

  return (
    <>
      <Row className="m-5">
        <Col>
          <Row>
            {books.length > 0 ? (
              books.map((book) => (
                <SingleBook key={book.asin} bookData={book} />
              ))
            ) : (
              <p>Nessun libro trovato per "{category}"</p>
            )}
          </Row>
        </Col>
      </Row>

      <Row className="m-5">
        <Col>
          <Form>
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Indietro
            </Button>
            <span>
              {currentPage}/{totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Avanti
            </Button>
            <Form.Select
              aria-label="limit pagination"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option>Open this select menu</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </Form.Select>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default BooksList;
