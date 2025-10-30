//----- Componenti react
import { React, useState, useContext } from "react";
//----- Componenti react-bootstrap
import { Form, Button } from "react-bootstrap";

//----- Context 
import { Theme } from '../../../modules/Context';


// dichiarazione delle costanti
const url = `https://striveschool-api.herokuapp.com/api/comments/`;

//----- AddComment.jsx
function AddComment({ bookId, updateListComment, setUpdateListComment, token }) {


  //variabile di stato Tema 
  let themeContext = useContext(Theme);
  
  
  //stato nuovo commento
  const [newComment, setNewComment] = useState({
    comment: "",
    rate: 0,
    elementId: bookId,
  });

  //acquisizione testo nuovo commento
  let handlerComment = (e) => {
    setNewComment({
      ...newComment,
      comment: e.target.value
    });
  };

  //acquisizione valutazione nuovo commento
  let handlerRate = (e) => {
    setNewComment({
      ...newComment,
      rate: e.target.value
    });
  };

 

  //POST del nuiovo commento  
  let postNewComment = () => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(newComment),
      headers: { 
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then(() => {
                
        setUpdateListComment(!updateListComment)//modifico stato per aggiornare lista commenti

        setNewComment({
          comment: "",
          rate: 0,
          elementId: bookId,
        })// resetto il form resettando newComment


      })
      
      .catch((error) => console.log("nessun nuovo commento agginto: " + error));
  };

  return (
    <>
      <Form className="mb-3">
        <Form.Group>
        <Form.Text className="text-muted">lascia una valutazione !</Form.Text>
          <Form.Control
            type="text"
            placeholder="commenta..."
            onChange={handlerComment}
            value={newComment.comment}
          />
        </Form.Group>

        <Form.Group>
          <Form.Select
            aria-label="Default select example"
            onChange={handlerRate}
            value={newComment.rate}
          >
            <option>Vota</option>
            <option value="1">★☆☆☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="3">★★★☆☆</option>
            <option value="4">★★★★☆</option>
            <option value="5">★★★★★</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mt-2">
          <Button variant={themeContext === 'dark' ? 'secondary' : 'info' } onClick={postNewComment}>
            salva
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}

export default AddComment;
