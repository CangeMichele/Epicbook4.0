//----- Componenti react
import { useEffect, useState } from "react";
//----- Componenti react-router-dom
import { useParams } from "react-router-dom";
// ----- Componenti context
import { useContext } from "react";
import { BooksContext } from "../Context/BooksContext";
// ----- API
import { getBooksByParams } from "../api/apiBooks.js";
//----- Componenti react-bootstrap
import { Row, Col, Button, Form, Alert } from "react-bootstrap";

// ----- Componenti app
import SingleBook from "../Components/book/SingleBook";

//*** popola la pagina con le anteprime dei libri estratti per categoria dal DB ***/
function BooksList() {
  //recupero  dal context dei libri
  const { category, categoryList, setCategory } = useContext(BooksContext);

  //stato libri caricati
  const [books, setBooks] = useState([]);

  //stati elementi per paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  
  //recupero categoria da URL
  const {category: categoryInParams} = useParams();
  useEffect(()=>{
    if(categoryList.includes(categoryInParams)) setCategory(categoryInParams);
    console.log("categoryInParams", categoryInParams);
    
  },[category])

  //estrazione libri nel db per categoria
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooksByParams({
          category: category,
          page: currentPage,
          limit: limit,
        });

        console.log("booksResult: ", response);
        //blocca se errore
        if (!response.data?.length) return response;

        setBooks(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error("errore richiesta libri categoria", error);
        setBooks([]);
      }
    };

    fetchBooks();
  }, [category, currentPage, limit]);

  return (
    <>
      {!category || !books.length ? (
        <Alert className="text-center">
          <h1>categoria: {category || "errore"}</h1>
          <h4>Si è verificato un problema.</h4>
          <h5>impossibile caricare libri per questa categoria</h5>
        </Alert>
      ) : (
        <>
          {/* LIBRI  */}
          <Row className="m-5">
            <Col>
              <Row>
                {books.map((book) => (
                  <SingleBook key={book.asin} bookData={book} />
                ))}
              </Row>
            </Col>
          </Row>

          {/* NAVIGATORE PAGINE */}
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
                  <option>visualizza per pagina</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </Form.Select>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default BooksList;
