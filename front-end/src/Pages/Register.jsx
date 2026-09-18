//----- Componenti react
import { useState, useContext } from "react";
// ----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";
// ----- Componenti context
import { AuthContext } from "../Context/AuthContext";

// ---- API
import { addUser } from "../api/apiUsers";
//---- Stilizzazone
import { Button, Form, InputGroup, Toast } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./register.css";

// *** ESTRAPOLAZIONE DATI DA FORM E SALAVATaGGIO IN DB ***
export default function Register() {
  //stato contenente dati form
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password0: "",
    password1: "",
    userName: "",
  });

  //stato errore respose back-end
  const [formError, setFormError] = useState(null);
  //stato errore front-end
  const [validated, setValidated] = useState(false);

  //stato contenente file da cricare
  const [fileAvatar, setFileAvatar] = useState(null);

  //stato mostra/nascondi password
  const [showPassword, setShowPassword] = useState(false);

  //stato attiva/chiudi toast errore
  const [triggerToast, setTriggerToast] = useState(false);

  //recupero stato token dal context
  const { setToken } = useContext(AuthContext);

  //navigatore
  const navigate = useNavigate();

  // -> GESTORE cambiamento input form registrazione
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
    //resetta stato errore di campo modificato
    if (formError?.details?.field === name) {
      setFormError(null);
    }
  };

  // -> GESTORE cambiamento file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileAvatar(file);
  };

  // -> GESTORE invio form registrazione
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
      const response = await addUser(registerData, fileAvatar);
      console.log("response: ", response);

      //in caso di errore
      if (!response.ok) {
        
        //se dal form cattuto errore
        if (response.error.code === "VALIDATION_ERROR") {
          setFormError(response.error);
        }else{
          //altrimenti tost errore 
          setTriggerToast(true);
        }
        return;
      }

      const token = response.token;

      if (!token) {
        alert("errore di login");
        navigate("/login");

        return;
      }

      //salvo token nel local storgae
      localStorage.setItem("EpicBookToken", token);
      //aggiorno token autenticazione
      setToken(token);

      //navigo all apagina utente
      navigate(`/user/${registerData.userName}`);
    } catch (error) {
      console.log("errore regitrazione", error);
      setTriggerToast(true);
    }
  };

  return (
    <>
      <Toast
        show={triggerToast}
        className="position-fixed top-10 start-50 translate-middle-x mt-3 text-bg-danger"
        bg="danger"
        onClose={() => {
          setTriggerToast(false);
          setValidated(false);
        }}
      >
        <Toast.Header closeButton>
          <strong className="me-auto">Errore</strong>
        </Toast.Header>
        <Toast.Body>Si è verificato un errore. Riprova più tardi.</Toast.Body>
      </Toast>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            onChange={handleChange}
            value={registerData.firstName}
            isInvalid={formError?.details?.field === "firstName"}
            required
          />
          <Form.Control.Feedback type="invalid">
            {formError?.message || "Campo vuoto"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="lastName">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            onChange={handleChange}
            value={registerData.lastName}
            isInvalid={formError?.details?.field === "lastName"}
            required
          />
          <Form.Control.Feedback type="invalid">
            {formError?.message || "Campo vuoto"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="birthDate">
          <Form.Label>Data di nascita</Form.Label>
          <Form.Control
            type="date"
            name="birthDate"
            onChange={handleChange}
            value={registerData.birthDate}
            isInvalid={formError?.details?.field === "birthdate"}
            required
          />
          <Form.Control.Feedback type="invalid">
            {formError?.message || "Campo vuoto"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={handleChange}
            value={registerData.email}
            isInvalid={formError?.details?.field === "email"}
            required
          />
          <Form.Control.Feedback type="invalid">
            {formError?.message || "Campo vuoto"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password0">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password0"
              onChange={handleChange}
              value={registerData.password0}
              isInvalid={formError?.details?.field === "password0"}
              placeholder="Inserisci nuova password"
              required
            />
            <button
              type="button"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </InputGroup>

          <Form.Text className="text-muted">
            Minimo 8 caratteri, almeno una maiuscola, un numero e un carattere
            speciale
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            {formError?.message || "Campo vuoto"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password1">
          <Form.Label>Ripeti password</Form.Label>
          <Form.Control
            type="password"
            name="password1"
            onChange={handleChange}
            value={registerData.password1}
            isInvalid={
              formError?.details?.field === "password" &&
              formError?.code === "BUSINESS_ERROR"
            }
            placeholder="Ripeti password"
            required
          />
          <Form.Control.Feedback type="invalid">
            {formError?.message || "Campo vuoto"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="userName">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            onChange={handleChange}
            value={registerData.userName}
            isInvalid={formError?.details?.field === "userName"}
            required
          />
          <Form.Control.Feedback type="invalid">
            {formError?.message || "Campo vuoto"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="avatar">
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
    </>
  );
}
