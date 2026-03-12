//----- Componenti react
import { useState, useContext } from "react";
// ----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";
// ----- Componenti context
import { AuthContext } from "../../Context/AuthContext";
// ---- Funzioni
import { validatorUserData } from "../../utils/validatorUSerData";
// ----- API
import { putUserData } from "../../service/apiUsers";
import { loginUser } from "../../service/apiAuth.js";
//----- Componenti react-bootstrap
import { Form, Row, Col, Button } from "react-bootstrap";

export default function UserDataUpdate({ setIsEditing }) {
  //recupero dati dal context
  const { userData, setUserData, resetAuth } = useContext(AuthContext);

  //navigatore
  const navigate = useNavigate();

  //stato dati editati
  const [dataEdit, setDataEdit] = useState({
    userName: userData.userName,
    firstName: userData.firstName,
    lastName: userData.lastName,
    birthDate: userData.birthDate,
    email: userData.email,
    oldPassword: "",
    password1: "",
    password2: "",
  });

  // stato tipologia errore
  const [errorType, setErrorType] = useState(null);
  // stato suggerimento username
  const [usernameSuggest, setUsernameSuggest] = useState("");

  // -> Gestore cambiamento input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataEdit({
      ...dataEdit,
      [name]: value,
    });

    //resetta stato errore di campo modificato
    if (
      errorType === `${name}_error` ||
      errorType === "invalidEmail_error" ||
      errorType === "existedEmail_error" ||
      errorType === "mismatch_error"
    ) {
      setErrorType(null);
    }
  };

  // -> Gestore suggertiemnto username
  const handleSuggestUsername = (suggest) => {
    setUsernameSuggest(suggest);
    setDataEdit({
      ...dataEdit,
      userName: suggest,
    });
  };

  // -> Gestore invio form di aggiornamento
  const handleSubmit = async (e) => {
    e.preventDefault();

    // esecuzione di controlli dati form
    const validatedUserData = await validatorUserData(dataEdit, userData);
    console.log("update: ", validatedUserData);

    // in caso di errore catturra l'errore
    if (!validatedUserData.status) {
      setErrorType(validatedUserData.details);

      //se errore username suggerisci
      if (validatedUserData.details === "userName_error") {
        handleSuggestUsername(validatedUserData.value);
      }

      return;
    }

    //se non ci sono modifiche esci
    if (!validatedUserData.data) {
      setIsEditing(false);
      return;
    }

    // se non trova errori prosegue
    setErrorType(null);

    try {
      const response = await putUserData(validatedUserData.data);

      // se password modificata aggiorna token
      if (validatedUserData.password) {
        resetAuth();

        //ottenimento token
        const resToken = await loginUser(loginFormData);

        // aggiungo valore token con context
        setToken(resToken.token);

        //salvataggio token  in localStorage
        localStorage.setItem("EpicBookToken", resToken.token);
      }

      //se cambia username cambia nome della pagina, quindi ricarica
      if (response.data.userName !== userData.userName) {
        //aggiorna dati utenti nel context
        setUserData(response.data);
        navigate(`/user/${response.data.userName}`);
      }

      //aggiorna dati utenti nel context
      setUserData(response.data);
      //chiudi modifica
      setIsEditing(false);
    } catch (error) {
      console.log("errore regitrazione", error);
      alert("errore registrazione");
    }
  };

  return (
    <>
      {/* form editing */}
      <Form noValidate validated={!!errorType} onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="username">
          <Form.Label column md={3}>
            Username
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="text"
              name="userName"
              onChange={handleChange}
              value={dataEdit?.userName || ""}
              isInvalid={errorType === "userName_error"}
              placeholder="Nuovo username"
            />
            <Form.Control.Feedback type="invalid">
              {usernameSuggest !== ""
                ? `Username esitente ! prova con ${usernameSuggest}`
                : "Inserisci un username"}
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
              placeholder="mofifica username"
            />
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
            />
          </Col>
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
              value={dataEdit.birthDate.slice(0, 10)}
              isInvalid={errorType === "birthDate_error"}
            />
            <Form.Control.Feedback type="invalid">
              Devi avere almeno 16 anni per poterti registrare !
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
              isInvalid={
                errorType === "invalidEmail_error" ||
                errorType === "existedEmail_error"
              }
            />
            <Form.Control.Feedback type="invalid">
              {errorType === "invalidEmail_error"
                ? "inserisci una email valida"
                : errorType === "existedEmail_error"
                  ? "questa email è già stata registrata"
                  : "errore email "}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="oldPassword">
          <Form.Label column md={3}>
            Password
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="password"
              name="oldPassword"
              onChange={handleChange}
              value={dataEdit.oldPassword}
              isInvalid={errorType === "oldPassword_error"}
              placeholder="Password attuale"
            />
            <Form.Control.Feedback type="invalid">
              Le password non corretta.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="password1">
          <Form.Label column md={3}>
            Nuova Password
          </Form.Label>
          <Col md={9}>
            <Form.Control
              type="password"
              name="password1"
              onChange={handleChange}
              value={dataEdit.password1}
              isInvalid={errorType === "password_error"}
              placeholder="Inserisci nuova passsword"
            />
            <Form.Text className="text-muted mt-">
              Minimo 8 caratteri, almeno una maiuscola, un numero e un carattere
              speciale
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              La password non rispetta i criteri di sicurezza.
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
              name="password2"
              onChange={handleChange}
              value={dataEdit.password2}
              isInvalid={errorType === "mismatch_password"}
              placeholder="Ripeti password"
            />
            <Form.Control.Feedback type="invalid">
              Le password non coincidono.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Button type="submit">Modifica</Button>
      </Form>
    </>
  );
}
