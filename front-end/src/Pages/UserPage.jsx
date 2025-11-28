// ----- Componenti context
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
//----- Componenti react-bootstrap
import {
  Col,
  Row,
  Card,
  ListGroup,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
// ----- Componenti Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faPenToSquare, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

export default function UserPage() {
  //recupero dati utente dal context
  const { userData } = useContext(AuthContext);

  //uso un ref per ancorare input nascosto con simulatore click
  const fileInputRef = useRef(null);

  //stato contenente url per anteprima di immmagine
  const [imgPreview, setImgPreview] = useState(null);

  //gestore cambiamento file
  const handleUpdateImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    //creo URL temporaneo file da utilizzare per anteprima
    const url = URL.createObjectURL(file);
    setImgPreview(url);
  };

  // gestore reset file
  const handleFileReset = () => {
    setImgPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  //simula il click su input file
  const clickSimulation = () => {
    fileInputRef.current.click();
  };

  const handleSaveUpdateImg = () =>{
    
  };

  return (
    <Card style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.1)", padding: "20px" }}>
      <Row>
        <Col md="4">
          <Card.Body style={{ position: "relative" }}>
            {/* icona moodifica immagine */}
            <FontAwesomeIcon
              icon={faImage}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "5px",
                fontSize: "28px",
                textShadow: "0 0 5px black",
                zIndex: 2,
                cursor: "pointer",
              }}
              onClick={clickSimulation}
            />

            {/* input caricamento nuova immagine */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleUpdateImgChange}
            />

            {/* immagine profilo */}
            <Card.Img
              variant="top"
              src={imgPreview ? imgPreview : userData?.avatar_url}
              style={{ objectFit: "cover", border: "1px solid red" }}
            />

            {/* pulsantti gestione nuova immagine */}
            <ButtonGroup
              style={{ display: `${imgPreview ? "block" : "none"}`, paddingTop:"10px", position:"absolute" }}
            >
              <ToggleButton onClick={{handleUpdateImg: handleSaveUpdateImg}}>
                <FontAwesomeIcon icon={faFloppyDisk} />
                salva
              </ToggleButton>
              <ToggleButton onClick={handleFileReset}>annulla</ToggleButton>
            </ButtonGroup>
          </Card.Body>
        </Col>

        <Col md="8">
          <Card.Body
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            {/* dati utente */}
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Card.Title>{userData?.userName}</Card.Title>
              </ListGroup.Item>
              <ListGroup.Item>Nome: {userData?.firstName}</ListGroup.Item>
              <ListGroup.Item>Cognome: {userData?.lastName}</ListGroup.Item>
              <ListGroup.Item>
                Data di nascita:{" "}
                {userData
                  ? Intl.DateTimeFormat("it-IT").format(
                      new Date(userData.birthDate)
                    )
                  : ""}
              </ListGroup.Item>
              <ListGroup.Item>
                Data di iscrizione:{" "}
                {userData
                  ? Intl.DateTimeFormat("it-IT").format(
                      new Date(userData.createdAt)
                    )
                  : ""}
              </ListGroup.Item>
              <ListGroup.Item>Email: {userData?.email}</ListGroup.Item>
            </ListGroup>

            {/* icona moodifica dati utente */}
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "5px",
                fontSize: "28px",
                textShadow: "0 0 5px black",
                zIndex: 2,
                cursor: "pointer",
              }}
            />
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}
