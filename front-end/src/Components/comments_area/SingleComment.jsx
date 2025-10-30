//----- Componenti react
import { React, useContext } from "react";
//----- Componenti react-bootstrap
import { ListGroup, Button } from "react-bootstrap";

// dichiarazione delle costanti
const url = `https://striveschool-api.herokuapp.com/api/comments/`;


//---- SingleComment.jsx
function SingleComment({
  commentProp,
  updateListComment,
  setUpdateListComment,
  token
}) {

  const [themeContext] = useContext(Theme);

  //DELETE del commento
  const deleteComment = (commentId) => {
    console.log('commentId: '+ commentId);
    fetch(url + commentId, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) =>{
       
        if (response.ok) {
          setUpdateListComment(!updateListComment); //modifico stato per aggiornare lista comment
       
        } else if (response.status === 401) {
          throw new Error("Autorizzazione non valida"); 
       
        } else {
          throw new Error("Errore durante l'eliminazione del commento");
        }
     
      })
      .catch((error) => console.log("eliminazione non riuscita: " + error));
  };

  return (
    <>
      <ListGroup.Item>
        <p>
          ({commentProp.rate}★) {commentProp.comment}
        </p>
        <Button
          variant={themeContext === "dark" ? "dark" : "danger"}
          className="btn-sm"
          onClick={() => deleteComment(commentProp._id)}
        >
          elimina
        </Button>
      </ListGroup.Item>

    </>
  );
}

export default SingleComment;
