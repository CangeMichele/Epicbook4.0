//----- Componenti react
import { React } from "react";
//----- Componenti react-bootstrap
import { Alert } from "react-bootstrap";



// ----- USerNotFound.jsx
export default function USerNotFound() {
  return (
    <>
      <Alert className="text-center">
        <h1>Utente inesistente</h1>
        <h3>riprova</h3>
      </Alert>
    </>
  );
}
