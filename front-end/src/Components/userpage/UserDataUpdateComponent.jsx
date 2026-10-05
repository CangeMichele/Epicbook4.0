//----- Componenti react
import { useState, useContext } from "react";
// ----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";
// ----- Componenti context
import { AuthContext } from "../../Context/AuthContext.jsx";
// ----- API
import { editUser } from "../../api/apiUsers.js";
//----- Componenti react-bootstrap
import { Form, Row, Col, Button, InputGroup, Modal } from "react-bootstrap";
// ----- Componenti app
import DeleteUserComponent from "./DeleteUserComponent.jsx";
//---- Stilizzazone
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function UserDataUpdateComponent({ setIsEditing, setTriggerToast }) {
  //recupero dati dal context
  const { userLogged, setUserLogged } = useContext(AuthContext);

  //navigatore
  const navigate = useNavigate();

  //stato dati upload
  const [dataEdit, setDataEdit] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    oldPassword: "",
    password0: "",
    password1: "",
  });

  //stato errore validità dati
  const [dataValidationError, setDataValidationError] = useState(null);
  //stato validate form update
  const [validated, setValidated] = useState(false);
  //stato mostra/nascondi vecchia password
  const [showOldPassword, setShowOldPassword] = useState(false);
  //stato mostra/nascondi nuova password
  const [showNewPassword, setShowNewPassword] = useState(false);

  //indicatore required campi password (attivo se ha valore almeno un campo password)
  const requiredPassword = Boolean(
    dataEdit.oldPassword || dataEdit.password0 || dataEdit.password1,
  );

  // -> GESTORE cambiamento input form update
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataEdit({
      ...dataEdit,
      [name]: value,
    });

    //resetta stato errore di campo modificato
    if (dataValidationError?.details?.field === name) {
      setDataValidationError(null);
    }
  };

  // -> GESTORE invio form di aggiornamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    setValidated(true);

    //controllo validità form
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    try {
      const response = await editUser(dataEdit);

      //catturo l'errore se presente
      if (!response.ok) {
        //se errore validazione dati catturo errore
        if (
          response.error?.code === "VALIDATION_ERROR" ||
          response.error?.code === "BUSINESS_ERROR"
        ) {
          setDataValidationError(response.error);
        } else {
          //se altro tipo di errore attivo toast
          setTriggerToast(true);
        }
        return;
      }

      //SE PASSWORD MODIFICATA => NUOVO TOKEN
      if (response.token) {
        //aggiornamento token  in localStorage
        localStorage.setItem("EpicBookToken", response.token);
      }
      // SE USERNAME MODIFICATO url cambia, quindi ricarica
      if (response.data?.userName !== userLogged?.userName) {
        //aggiorna dati utenti nel context
        navigate(`/user/${response.data.userName}`);
      }

      //aggiorna dati utenti nel context
      setUserLogged(response.data);
      //chiudi modifica
      setIsEditing(false);
    } catch (error) {
      console.error("errore modifica", error);
      alert("errore modifica");
    }
  };

  return (
    <>
      {/* ----- FORM EDITING ----- */}
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        id="updateUserForm"
      >
        <Form.Group as={Row} className="mb-3" controlId="username">
          <Form.Label column md={3}>
            Username
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="userName"
              onChange={handleChange}
              value={dataEdit.userName || userLogged?.userName}
              isInvalid={dataValidationError?.details?.field === "userName"}
              required
            />
            <Form.Control.Feedback type="invalid">
              {dataValidationError?.message || "Campo vuoto"}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="name">
          <Form.Label column md={3}>
            Nome
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="firstName"
              onChange={handleChange}
              value={dataEdit.firstName || userLogged?.firstName}
              isInvalid={dataValidationError?.details?.field === "firstName"}
              required
            />
            <Form.Control.Feedback type="invalid">
              {dataValidationError?.message || "Campo vuoto"}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="lastName">
          <Form.Label column md={3}>
            Cognome
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="lastName"
              onChange={handleChange}
              value={dataEdit.lastName || userLogged?.lastName}
              isInvalid={dataValidationError?.details?.field === "lastName"}
              required
            />
          </Col>
          <Form.Control.Feedback type="invalid">
            {dataValidationError?.message || "Campo vuoto"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="birthDate">
          <Form.Label column md={3}>
            Data di nascita
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="date"
              name="birthDate"
              onChange={handleChange}
              value={dataEdit.birthDate || userLogged?.birthDate}
              isInvalid={dataValidationError?.details?.field === "birthDate"}
              required
            />
            <Form.Control.Feedback type="invalid">
              {dataValidationError?.message || "Campo vuoto"}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="email">
          <Form.Label column md={3}>
            Email
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="email"
              name="email"
              onChange={handleChange}
              value={dataEdit.email || userLogged?.email}
              isInvalid={dataValidationError?.details?.field === "email"}
              required
            />
            <Form.Control.Feedback type="invalid">
              {dataValidationError?.message || "Campo vuoto"}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="oldPassword">
          <Form.Label column md={3}>
            Password
          </Form.Label>
          <Col md={9}>
            <InputGroup>
              <Form.Control
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                onChange={handleChange}
                value={dataEdit.oldPassword || userLogged?.oldPassword}
                isInvalid={
                  dataValidationError?.details?.field === "oldPassword"
                }
                placeholder="Password attuale"
                required={requiredPassword}
              />
              <Form.Control.Feedback type="invalid">
                {dataValidationError?.message || "Campo vuoto"}
              </Form.Control.Feedback>
              <button
                type="button"
                onClick={() => {
                  setShowOldPassword(!showOldPassword);
                }}
              >
                <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
              </button>
            </InputGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="password1">
          <Form.Label column md={3}>
            Nuova Password
          </Form.Label>
          <Col md={9}>
            <InputGroup>
              <Form.Control
                type={showNewPassword ? "text" : "password"}
                name="password0"
                onChange={handleChange}
                value={dataEdit.password0}
                isInvalid={dataValidationError?.details?.field === "password"}
                placeholder="Inserisci nuova password"
                required={requiredPassword}
              />
              <button
                type="button"
                onClick={() => {
                  setShowNewPassword(!showNewPassword);
                }}
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
              </button>
            </InputGroup>
            <Form.Text className="text-muted mt-">
              Minimo 8 caratteri, almeno una maiuscola, un numero e un carattere
              speciale
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {dataValidationError?.message || "Campo vuoto"}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="password2">
          <Form.Label column md={3}>
            Ripeti password
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="password"
              name="password1"
              onChange={handleChange}
              value={dataEdit.password1}
              isInvalid={
                dataValidationError?.details?.field === "password" &&
                dataValidationError?.code === "BUSINESS_ERROR"
              }
              placeholder="Ripeti password"
              required={requiredPassword}
            />
            <Form.Control.Feedback type="invalid">
              {dataValidationError?.message || "Campo vuoto"}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
      </Form>

      <diV className="d-flex">
        <Button type="submit" form="updateUserForm">
          Modifica
        </Button>
        <Button onClick={() => setIsEditing(false)} type="button">
          annulla
        </Button>
        {/* ----- ELIMINAZIONE UTENTE -----  */}
        <DeleteUserComponent />
      </diV>
    </>
  );
}
