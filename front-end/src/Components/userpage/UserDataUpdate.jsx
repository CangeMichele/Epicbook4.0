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
    password0: "",
    password1: "",
  });

  //stato errore respose back-end
  const [formError, setFormError] = useState(null);
  //stato errore front-end
  const [validated, setValidated] = useState(false);

  //valore required campi password (se un valore è true allora tutti campi required)
  const requiredPassword = Boolean(
    dataEdit.OldPassw || 
    dataEdit.password0 || 
    dataEdit.password1,
  );

  // -> GESTORE cambiamento input form modifica
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataEdit({
      ...dataEdit,
      [name]: value,
    });

    //resetta stato errore di campo modificato
    if (formError.details?.field === name) {
      setFormError(null);
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
        setFormError(response.error);
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

      // SE USERNAME MODIFICATO cambia nome della pagina, quindi ricarica
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
      console.log("errore modifica", error);
      alert("errore modifica");
    }
  };

  return (
    <>
      {/* form editing */}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
              isInvalid={formError?.details?.field === "userName"}
              required
            />
            <Form.Control.Feedback type="invalid">
              {formError?.message || "Campo vuoto"}
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
              isInvalid={formError?.details?.field === "firstName"}
              required
            />
            <Form.Control.Feedback type="invalid">
              {formError?.message || "Campo vuoto"}
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
              isInvalid={formError?.details?.field === "lastName"}
              required
            />
          </Col>
          <Form.Control.Feedback type="invalid">
            {formError?.message || "Campo vuoto"}
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
              isInvalid={formError?.details?.field === "birthDate"}
              required
            />
            <Form.Control.Feedback type="invalid">
              {formError?.message || "Campo vuoto"}
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
              isInvalid={formError?.details?.field === "email"}
              required
            />
            <Form.Control.Feedback type="invalid">
              {formError?.message || "Campo vuoto"}
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
              isInvalid={formError?.details?.field === "oldPassword"}
              placeholder="Password attuale"
              required={requiredPassword}
            />
            <Form.Control.Feedback type="invalid">
              {formError?.message || "Campo vuoto"}
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
              name="password0"
              onChange={handleChange}
              value={dataEdit.password0}
              isInvalid={formError?.details?.field === "password"}
              placeholder="Inserisci nuova password"
              required={requiredPassword}
            />
            <Form.Text className="text-muted mt-">
              Minimo 8 caratteri, almeno una maiuscola, un numero e un carattere
              speciale
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {formError?.message || "Campo vuoto"}
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
                formError?.details?.field === "password" &&
                formError?.code === "BUSINESS_ERROR"
              }
              placeholder="Ripeti password"
              required={requiredPassword}
            />
            <Form.Control.Feedback type="invalid">
              {formError?.message || "Campo vuoto"}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Button type="submit">Modifica</Button>
        <Button onClick={() => setIsEditing(false)}>annulla</Button>
      </Form>
    </>
  );
}
