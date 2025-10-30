//----- Componenti react
import { React, useState } from "react";
//----- Componenti react-bootstrap
import { Button, Container, Form } from "react-bootstrap";
//----- Componenti react-router-dom
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  //gestore cambiamento input form login
  const handleChangeLoginForm = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  //gestore invio form login 
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUSer(formData);

      //memorizza token in local storage
      localStorage.setItem("token", response.token);

      //trigger aggiornamento Navbar
    //   localStorage.dispatchEvent(new Event("storage"));

      alert("Login effettuato con successo!");

      navigate("/");

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
            value={loginFormData.email}
            required
          />
        </Form.Group>

        <Form.Group controlId="log-password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
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
