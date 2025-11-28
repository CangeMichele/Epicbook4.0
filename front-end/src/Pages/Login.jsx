//----- Componenti react
import { useState } from "react";
//----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";
// ----- Componenti context
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
// ----- API
import { loginUser } from "././../service/apiAuth.js";

//----- Componenti react-bootstrap
import { Button, Container, Form } from "react-bootstrap";

export default function Login() {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { setToken } = useContext(AuthContext);

  //gestore cambiamento input form login
  const handleChangeLoginForm = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  //gestore invio form login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      //ottenimento token
      const response = await loginUser(loginFormData);

      // aggiungo valore token con context
      setToken(response.token);

      //salvataggio token  in localStorage
      localStorage.setItem("EpicBookToken", response.token);

      navigate("/");

      // TO DO : una volta collegato vai alla tua pagina personale "/:nomeutente". se sei tu vedi modifica sennò solo dati
      // navigate(`/user/:${user}`);
    } catch (error) {
      console.error("Errore autenticazione", error);
      alert("Credenziali errate");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="log-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={handleChangeLoginForm}
            placeholder="ciao@ciao.com"
            value={loginFormData.email}
            required
          />
        </Form.Group>

        <Form.Group controlId="log-password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Ciao123!"
            onChange={handleChangeLoginForm}
            value={loginFormData.password}
            required
          />
        </Form.Group>

        <Button type="submit">Accedi</Button>

        <Form.Group controlId="to-reg">
          <Form.Label className="me-2">Non sei reistrato ?</Form.Label>
          <Button href="/register">Registrati</Button>
        </Form.Group>
      </Form>
    </Container>
  );
}
