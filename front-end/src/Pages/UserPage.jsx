// ----- Componenti react
import { useContext, useEffect, useRef, useState } from "react";
// ----- Componenti context
import { AuthContext } from "../Context/AuthContext";
//----- Componenti react-router-dom
import { useParams, useNavigate } from "react-router-dom";
// ----- API
import { getByUsername, putUser } from "../service/apiUsers";
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
  const { userData, userDataLoading } = useContext(AuthContext);

  //recupero nome utente dal pamars
  const params = useParams();
  const userProfile = params.user;

  //stato dati dell'utente
  const [profileData, setProfileData] = useState(null);
  //stato contenente immagine da caricare
  const [imgUpload, setImgUpload] = useState(null);

  //navigatore
  const navigate = useNavigate();

  // ----- Estrapolazione dati utente
  useEffect(() => {
    //se i dati sono ancora incaricamento non fare nulla
    if (userDataLoading) return;

    //se pagina apprtiene a utente loggato prendo i dati dal context
    if (userData && userData.userName === userProfile) {
      setProfileData(userData);
      return;
    }

    //altrimenti li recuopero dal db
    const fetchProfileData = async () => {
      try {
        const response = await getByUsername(userProfile);
        if (!response) {
          // utente non trovato
          alert("utente non trovato");
          navigate("/");
        } else {
          setProfileData(response);
        }
      } catch (error) {
        alert("errore nella ricerca");
        navigate("/");
      }
    };
    fetchProfileData();
  }, [userProfile, userData, userDataLoading, navigate]);

  //uso un ref per ancorare input nascosto con simulatore click
  const fileInputRef = useRef(null);

  //stato contenente url per anteprima di immmagine
  const [urlImgPreview, setUrlImgPreview] = useState(null);

  //----- gestore cambiamento file
  const handleUpdateImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImgUpload(file);

    //creo URL temporaneo file da utilizzare per anteprima
    const url = URL.createObjectURL(file);
    setUrlImgPreview(url);
  };

  // gestore reset file
  const handleFileReset = () => {
    setUrlImgPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  //simula il click su input file
  const clickSimulation = () => {
    fileInputRef.current.click();
  };

  const handleSaveUpdateImg = async () => {
    //controllo presenza nuova immagine
    if (!imgUpload) return;

    //formData contenente upload
    const uploadAvatar = new FormData();
    uploadAvatar.append("avatar", imgUpload);
    uploadAvatar.append("user_id", userData._id);
    uploadAvatar.append("fileName", "avt_" + userData._id);

    try {
      await putUser(uploadAvatar);
    } catch (error) {
      alert(" errore nell'upload: " + error);
    }

    setUrlImgPreview(null);
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
              src={urlImgPreview ? urlImgPreview : profileData?.avatar_url}
              style={{ objectFit: "cover", border: "1px solid red" }}
            />

            {/* pulsantti gestione nuova immagine */}
            <ButtonGroup
              style={{
                display: `${urlImgPreview ? "block" : "none"}`,
                paddingTop: "10px",
                position: "absolute",
              }}
            >
              <ToggleButton onClick={handleSaveUpdateImg}>
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
                <Card.Title>{profileData?.userName}</Card.Title>
              </ListGroup.Item>
              <ListGroup.Item>Nome: {profileData?.firstName}</ListGroup.Item>
              <ListGroup.Item>Cognome: {profileData?.lastName}</ListGroup.Item>
              <ListGroup.Item>
                Data di nascita:{" "}
                {profileData?.birthDate
                  ? Intl.DateTimeFormat("it-IT").format(
                      new Date(profileData.birthDate)
                    )
                  : ""}
              </ListGroup.Item>
              <ListGroup.Item>
                Data di iscrizione:{" "}
                {profileData?.createdAt
                  ? Intl.DateTimeFormat("it-IT").format(
                      new Date(profileData.createdAt)
                    )
                  : ""}
              </ListGroup.Item>
              <ListGroup.Item>Email: {profileData?.email}</ListGroup.Item>
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
