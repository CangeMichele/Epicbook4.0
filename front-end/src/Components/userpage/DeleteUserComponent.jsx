//----- Componenti react
import { useState, useContext } from "react";
// ----- Componenti context
import { AuthContext } from "../../Context/AuthContext.jsx";
// ----- API
import { deleteUser } from "../../api/apiUsers.js";
//----- Componenti react-bootstrap
import { Form, Button, Modal } from "react-bootstrap";
//---- Stilizzazone
import "bootstrap/dist/css/bootstrap.min.css";

export default function DeleteUserComponent() {
  //recupero dati dal context
  const { logout } = useContext(AuthContext);

  //stato dati da inviare
  const [inputDelete, setInputDelete] = useState({
    password: "",
  });

  //stato mostra/nascondi modale
  const [showModal, setShowModal] = useState(false);
  //stato validate form delete
  const [validated, setValidated] = useState(false);
  //stato errore
  const [error, setError] = useState(null);

  // -> GESTORE cambiamento input password
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputDelete({
      ...inputDelete,
      [name]: value,
    });

    //resetta stato errore di campo modificato
    if (error?.details?.field === name) {
      setError(null);
    }
  };

  // -> GESTORE invio password e cancellazione
  const handleDelete = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    setValidated(true);
    setError(null);

    //controllo validità form
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    try {
      const response = await deleteUser(inputDelete);

      //catturo l'errore se presente
      if (!response.ok) {
        console.log(response);

        setError(response.error);

        return;
      }
      setShowModal(false);
      logout();
    } catch (error) {
      console.error("errore eliminazione", error);
      setError(error.data.error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button
          onClick={() => setShowModal(true)}
          variant="danger"
          type="button"
        >
          elimina
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4>confermare elimninazione ?</h4>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleDelete}
            id="deleteUserForm"
          >
            <Form.Group controlId="passwordForDelete">
              <Form.Label>Inserisci la password e conferma.</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
                value={inputDelete.password}
                isInvalid={!!error}
                placeholder="password"
                required
              />
              <Form.Control.Feedback type="invalid">
                {!error
                  ? "Inserisci password ! "
                  : error?.code === "AUTH_ERROR"
                    ? "Password bagliata"
                    : "Non è possibile prodere. Riprova più tardi"}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          ATTENZIONE ! Il processo è irreversibile
          <Button variant="danger" type="submit" form="deleteUserForm">
            conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
