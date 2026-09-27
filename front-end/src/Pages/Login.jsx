//----- Componenti react
import { useState, useContext } from "react";
// ----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";
// ----- Componenti context
import { AuthContext } from "../Context/AuthContext";
// ----- API
import { loginUser } from "../api/apiAuth";
//----- Stilizzazione
import { Button, Form, InputGroup, Toast } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// *** LOGIN UTENTE E NAVIGAZIONE PAGINA PROFILO ***
export default function Login() {
  //stato form login
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  //recupero assegnatore token dal context
  const { setToken } = useContext(AuthContext);

  //stato errore di login
  const [loginError, setLoginError] = useState(null);

  //stato validità form
  const [isFormValid, setIsFormValid] = useState(false);

  //stato mostra/nascondi password
  const [showPassword, setShowPassword] = useState(false);

  //stato attiva/chiudi toast errore
  const [triggerToast, setTriggerToast] = useState(false);

  //navigatore
  const navigate = useNavigate();

  // -> GESTORE cambiamento input form login
  const handleChangeLoginForm = (e) => {
    const { name, value } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
    //resetta stato errore di campo modificato
    if (loginError?.details?.field === name) {
      setLoginError(null);
    }
  };

  // -> GESTORE invio form login
  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    setIsFormValid(true);

    //controllo validità form
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }
    try {
      //ottenimento token
      const response = await loginUser(loginFormData);

      // aggiungo valore token con context
      setToken(response.token);

      //salvataggio token  in localStorage
      localStorage.setItem("EpicBookToken", response.token);

      //token => useEffect in authContext
      // autContext => isLogged
      // isLogged => element Route in myMain
      // Route => UserPage
    } catch (error) {
      //se erore validazione dati catturo errore
      if (error.response?.data?.error?.code === "AUTH_ERROR") {
        setLoginError(error.response?.data?.error);
        setIsFormValid(false)
      } else {
        //se altro tipo di errore attivo toast
        setTriggerToast(true);
      }
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
          setIsFormValid(false);
        }}
      >
        <Toast.Header closeButton>
          <strong className="me-auto">Errore</strong>
        </Toast.Header>
        <Toast.Body>Si è verificato un errore. Riprova più tardi.</Toast.Body>
      </Toast>

      <Form noValidate validated={isFormValid} onSubmit={handleSubmitLogin}>
        <Form.Group controlId="log-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={handleChangeLoginForm}
            value={loginFormData.email}
            isValid={loginError?.code !== "AUTH_ERROR"}
            isInvalid={loginError?.details?.field === "email"}
            placeholder="ciao@ciao.com"
            required
          />
          <Form.Control.Feedback type="invalid">
            {loginError?.message || "Email non valida"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="log-password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChangeLoginForm}
              value={loginFormData.password}
              isValid={loginError?.code === "AUTH_ERROR"}
              isInvalid={loginError?.details?.field === "password"}
              placeholder="Ciao123!"
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
            <Form.Control.Feedback type="invalid">
              {loginError?.message || "Password non valida"}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Button type="submit">Accedi</Button>

        <Form.Group controlId="to-reg">
          <Form.Label className="me-2">Non sei reistrato ?</Form.Label>
          <Button href="/register">Registrati</Button>
        </Form.Group>
      </Form>
    </>
  );
}
