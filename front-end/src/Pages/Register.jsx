//----- Componenti react
import { useState } from "react";
// ---- Funzioni
import newUserControls from "../Components/users/newUserControls";
import { addUser } from "../service/apiUsers";
//---- Stilizzazone
import { Button, Container, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./register.css";
import { use } from "react";

// *** estrapolazione dati da form e inserimento in DB ***
export default function Register() {
  //stato contenente dati form
  const [registerFormData, setRegisterFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password1: "",
    password2: "",
    avatar: "",
    userName: "",
  });

  // stato validità form
  const [validatedForm, setValidatedForm] = useState(false);
  // stato tipoliogia errore
  const [errorType, setErrorType] = useState();
  // stato messaggio di errore
  const [errorMessage, setErrorMessage] = useState();

  //gestore cambiamento input form registrazione
  const handleChangeRegisterForm = (e) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    });
  };

  //gestore cambiamento file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setRegisterFormData({
      ...registerFormData,
      avatar: file,
    });
  };

  //gestore invio form registrazione
  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.currentTarget; //controllo validità form

    setValidatedForm(true);

    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    // esecuzione di controlli dati form
    const newUser = await newUserControls(registerFormData);

    //se errori, blocca
    if (!newUser.status) {
      setErrorMessage(newUser.message);
      console.log("errore" + errorMessage);

      return;
    }

    setErrorMessage();
    setErrorType();

    try {
      await addUser(newUser.objectData);
      console.info("utente registrato");

      //reset del form
      setRegisterFormData({
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        password1: "",
        password2: "",
        avatar: null,
        userName: "",
      });
      setValidatedForm(false);
    } catch (error) {
      console.log("errore regitrazione", error);
      alert("errore registrazione");
    }
  };

  return (
    <Container>
      <Form noValidate validated={validatedForm} onSubmit={handleRegister}>
        <Form.Group controlId="reg-name">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            onChange={handleChangeRegisterForm}
            value={registerFormData.firstName}
            isInvalid={
              (validatedForm && !registerFormData.firstName) ||
              errorType === "firstname_error"
            }
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-lastName">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            onChange={handleChangeRegisterForm}
            value={registerFormData.lastName}
            isInvalid={
              (validatedForm && !registerFormData.lastName) ||
              errorType === "lastname_error"
            }
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-birthDate">
          <Form.Label>Data di nascita</Form.Label>
          <Form.Control
            type="date"
            name="birthDate"
            onChange={handleChangeRegisterForm}
            value={registerFormData.birthDate}
            isInvalid={
              (validatedForm && !registerFormData.birthDate) ||
              errorType === "birthdate_error"
            }
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={handleChangeRegisterForm}
            value={registerFormData.email}
            isInvalid={
              (validatedForm && !!errorMessage) || errorType === "email_error"
            }
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-password1">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password1"
            onChange={handleChangeRegisterForm}
            value={registerFormData.password1}
            isInvalid={
              (validatedForm && !!errorMessage) ||
              errorType === "password_error"
            }
            placeholder="Minimo 8 caratteri fra cui almeno una maiuscola, un numero e un carattere speciale"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-password2">
          <Form.Label>Ripeti password</Form.Label>
          <Form.Control
            type="password"
            name="password2"
            onChange={handleChangeRegisterForm}
            value={registerFormData.password2}
            isInvalid={
              (validatedForm && !!errorMessage) ||
              errorType === "mismatch_error"
            }
            placeholder="Ripeti password"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-userName">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            onChange={handleChangeRegisterForm}
            value={registerFormData.userName}
            isInvalid={
              (validatedForm && !!errorMessage) ||
              errorType === "username_error"
            }
          />
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-avatar">
          <Form.Label>Avatar</Form.Label>
          <Form.Control type="file" name="avatar" onChange={handleFileChange} />
        </Form.Group>

        <Button type="submit">Registrati</Button>
      </Form>
    </Container>
  );
}
