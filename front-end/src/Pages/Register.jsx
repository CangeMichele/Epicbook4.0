//----- Componenti react
import { useState } from "react";
// ----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";
// ----- Componenti context
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
// ---- Funzioni
import { validatorUserData } from "../utils/validatorUSerData";
// ---- API
import { addUser } from "../service/apiUsers";
//---- Stilizzazone
import { Button, Container, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./register.css";

// *** estrapolazione dati da form e inserimento in DB ***
export default function Register() {
  //stato contenente dati form
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password1: "",
    password2: "",
    userName: "",
  });

  //stato contenente file da cricare
  const [fileAvatar, setFileAvatar] = useState(null);

  // stato validità form
  const [validatedForm, setValidatedForm] = useState(false);

  // stato tipologia errore
  const [errorType, setErrorType] = useState();

  // stato suggerimento username
  const [usernameSuggest, setUsernameSuggest] = useState("");

  //recupero stato token dal context
  const { setToken } = useContext(AuthContext);

  //navigatore
  const navigate = useNavigate();

  // -> Gestore cambiamento input form registrazione
  const handleChangeRegisterForm = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
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

  // -> Gestore cambiamento file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileAvatar(file);
  };

  // -> Gestore suggertiemnto username
  const handleSuggestUsername = (suggest) => {
    setUsernameSuggest(suggest);
    setRegisterData({
      ...registerData,
      userName: suggest,
    });
  };

  // -> Gestore invio form registrazione
  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    setValidatedForm(true);

    //controllo validità form
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    // esecuzione di controlli dati form
    const newUser = await validatorUserData({
      mode: "register",
      data: registerData,
    });

    // in caso di errore catturra l'errore
    if (!newUser.status) {
      setErrorType(newUser.details);

      //se errore username suggerisci
      if (newUser.details === "userName_error") {
        handleSuggestUsername(newUser.userName);
      }

      return;
    }

    // se non trova errori prosegue
    setErrorType();

    try {
      const responseAddUser = await addUser(newUser.data, fileAvatar);
      const token = responseAddUser.token;

      if (!token) {
        alert("errore di login")
        navigate("/login");
        
        return;
      }
      
      //salvo token nel local storgae
      localStorage.setItem("EpicBookToken", token);
      //aggiorno token autenticazione
      setToken(token);

      //reset del form
      setRegisterData({
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
      setUsernameSuggest("");

      navigate(`/`);
    } catch (error) {
      console.log("errore regitrazione", error);
      alert("errore registrazione", error);
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
            value={registerData.firstName}
            isInvalid={validatedForm && errorType === "firstName_error"}
            required
          />
          <Form.Control.Feedback type="invalid">
            Inserisci il tuo nome
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-lastName">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            onChange={handleChangeRegisterForm}
            value={registerData.lastName}
            isInvalid={validatedForm && errorType === "lastName_error"}
            required
          />
          <Form.Control.Feedback type="invalid">
            Inserisci il tuo cognome
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-birthDate">
          <Form.Label>Data di nascita</Form.Label>
          <Form.Control
            type="date"
            name="birthDate"
            onChange={handleChangeRegisterForm}
            value={registerData.birthDate}
            isInvalid={validatedForm && errorType === "birthDate_error"}
            required
          />
          <Form.Control.Feedback type="invalid">
            Devi avere almeno 16 anni per poterti registrare !
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={handleChangeRegisterForm}
            value={registerData.email}
            i
            isInvalid={
              validatedForm &&
              (errorType === "invalidEmail_error" ||
                errorType === "existedEmail_error")
            }
            required
          />
          <Form.Control.Feedback type="invalid">
            {errorType === "invalidEmail_error"
              ? "Inserisci una email valida"
              : errorType === "existedEmail_error"
                ? "Questa email è già stata registrata"
                : "Inserisci email"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-password1">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password1"
            onChange={handleChangeRegisterForm}
            value={registerData.password1}
            isInvalid={validatedForm && errorType === "password_error"}
            placeholder="Minimo 8 caratteri fra cui almeno una maiuscola, un numero e un carattere speciale"
            required
          />
          <Form.Control.Feedback type="invalid">
            La password non rispetta i criteri di sicurezza.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-password2">
          <Form.Label>Ripeti password</Form.Label>
          <Form.Control
            type="password"
            name="password2"
            onChange={handleChangeRegisterForm}
            value={registerData.password2}
            isInvalid={validatedForm && errorType === "mismatch_error"}
            placeholder="Ripeti password"
            required
          />
          <Form.Control.Feedback type="invalid">
            Le password non coincidono.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-userName">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            onChange={handleChangeRegisterForm}
            value={registerData.userName}
            isInvalid={
              validatedForm &&
              (!registerData.userName || errorType === "userName_error")
            }
          />
          <Form.Control.Feedback type="invalid">
            {usernameSuggest !== ""
              ? `Username esitente ! prova con ${usernameSuggest}`
              : "Inserisci un username"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="reg-avatar">
          <Form.Label>Avatar</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            name="avatar"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button type="submit">Registrati</Button>
      </Form>
    </Container>
  );
}
