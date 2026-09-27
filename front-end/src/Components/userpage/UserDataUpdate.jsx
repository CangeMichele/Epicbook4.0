//----- Componenti react
import { useState, useContext } from "react";
// ----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";
// ----- Componenti context
import { AuthContext } from "../../Context/AuthContext";
// ----- API
import { editUser } from "../../api/apiUsers.js";
import { loginUser } from "../../api/apiAuth.js";
//----- Componenti react-bootstrap
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
//---- Stilizzazone
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function UserDataUpdate({ setIsEditing, setTriggerToast }) {
  //recupero dati dal context
  const { userLogged, setUserLogged, resetAuth } = useContext(AuthContext);

  //navigatore
  const navigate = useNavigate();

  //stato dati editati
  const [dataEdit, setDataEdit] = useState({
    userName: userLogged.userName,
    firstName: userLogged.firstName,
    lastName: userLogged.lastName,
    birthDate: userLogged.birthDate,
    email: userLogged.email,
    oldPassword: "",
    password0: "",
    password1: "",
  });

  //stato errore validità dati
  const [dataValidationError, setDataValidationError] = useState(null);
  //stato validità form
  const [isFormValid, setIsFormValid] = useState(false);
  //stato mostra/nascondi vecchia password
  const [showOldPassword, setShowOldPassword] = useState(false);
  //stato mostra/nascondi nuova password
  const [showNewPassword, setShowNewPassword] = useState(false);

  //indicatore required campi password (attivo se ha valore almeno un campo password)
  const requiredPassword = Boolean(
    dataEdit.oldPassword || dataEdit.password0 || dataEdit.password1
  );

  // -> GESTORE cambiamento input form modifica
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

  // -> GESTORE cambiamento file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileAvatar(file);
  };

  // -> GESTORE invio form di aggiornamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    console.log("birthDate: ", dataEdit.birthDate);

    setIsFormValid(true);

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
        console.log("error: ", response);
        if (response.error.code === "VALIDATION_ERROR") {
          
          setDataValidationError(response.error);
        } else {
          //se altro tipo di errore attivo toast
          setTriggerToast(true);
        }
        return;
      }

      //SE PASSWORD MODIFICATA
      if (dataEdit.password0) {
        //utilizzo funzioni AuthContext per aggiornare token
        resetAuth();
        //ottenimento token
        const resToken = await loginUser(loginFormData);
        // aggiungo valore token con context
        setToken(resToken.token);
        //salvataggio token  in localStorage
        localStorage.setItem("EpicBookToken", resToken.token);
      }

      // SE USERNAME MODIFICATO url cambia, quindi ricarica
      if (response.data.userName !== userLogged.userName) {
        //aggiorna dati utenti nel context
        setUserLogged(response.data);
        navigate(`/user/${response.data.userName}`);
      }

      //aggiorna dati utenti nel context
      setUserLogged(response.data);
      //chiudi modifica
      setIsEditing(false);
    } catch (error) {
      console.log("errore modifica", error);
      alert("errore modifica");
    }
  };

  return (
    <>
      {/* form editing */}
      <Form noValidate validated={isFormValid} onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="username">
          <Form.Label column md={3}>
            Username
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="userName"
              onChange={handleChange}
              value={dataEdit.userName}
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
              value={dataEdit.firstName}
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
              value={dataEdit.lastName}
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
              value={
                dataEdit.birthDate ? dataEdit.birthDate.substring(0, 10) : ""
              }
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
              value={dataEdit.email}
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
                value={dataEdit.oldPassword}
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

        <Button type="submit">Modifica</Button>
        <Button onClick={() => setIsEditing(false)}>annulla</Button>
      </Form>
    </>
  );
}
