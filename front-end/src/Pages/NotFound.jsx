//----- Componenti react
import { React } from "react";
//----- Componenti react-bootstrap
import { Alert } from "react-bootstrap";



// ----- NotFound.jsx
export default function NotFound() {
  return (
    <>
      <Alert className="text-center">
        <h1>Pagina non trovata</h1>
        <h3>Errore 404</h3>
      </Alert>
    </>
  );
}
