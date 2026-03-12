// ----- Componenti react
import { useContext, useEffect, useRef, useState } from "react";
// ----- Componenti context
import { AuthContext } from "../../Context/AuthContext";
//----- Componenti react-bootstrap
// ----- API
import { putAvatar } from "../../service/apiUsers";
import { Card, ButtonGroup, ToggleButton } from "react-bootstrap";
// ----- Componenti Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";


export default function UpdateAvatar({isMyProfile,displayedUser }) {
  
   //recupero dati utente dal context
  const { userData, setUserData } = useContext(AuthContext);

  //ref per ancorare input nascosto con simulatore click
  const fileInputRef = useRef(null);

  //link avatar default
  const defaultAvatarUrl =
    "https://res.cloudinary.com/dvbmskxg4/image/upload/v1768324486/epicbook/avatar/avt_default.png";
  
    //stato contenente immagine da caricare
  const [imgUpload, setImgUpload] = useState(null);

  //stato contenente url per anteprima di immmagine
  const [urlImgPreview, setUrlImgPreview] = useState(null);


  // --> ad ogni cambio di immagine cancella url generato in precedenza
  useEffect(() => {
    if (!urlImgPreview) return;

    return () => {
      URL.revokeObjectURL(urlImgPreview);
    };
  }, [urlImgPreview]);

  // --> gestore cambiamento file
  const handleUpdateImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImgUpload(file);

    //creo URL temporaneo file da utilizzare per anteprima
    const url = URL.createObjectURL(file);
    setUrlImgPreview(url);
  };

  // --> gestore reset file
  const handleFileReset = () => {
    setUrlImgPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  //-->  simulatore di click modifica avatar
  const clickSimulation = () => {
    fileInputRef.current.click();
  };

  // --> gestore salvataggio immagine
  const handleSaveUpdateImg = async () => {
    //controllo presenza nuova immagine
    if (!imgUpload) return;

    //formData contenente upload
    const uploadFormData = new FormData();

    //popolo formdata
    uploadFormData.append("avatar", imgUpload);
    uploadFormData.append("avatar_id", userData.avatar_id);
    uploadFormData.append("user_id", userData._id);

    try {
      const resultPutAvt = await putAvatar({ avtFormData: uploadFormData });

      //aggiorno userData
      setUserData((prev) => ({
        ...prev,
        avatar_url: resultPutAvt.avatar_url,
        avatar_id: resultPutAvt.avatar_id,
      }));
    } catch (error) {
      alert(" errore nell'upload: " + error);
    }
    setImgUpload(null);
  };

  //--> cancella preview aspettando che usardata sia aggiornato
  useEffect(() => {
    if (userData?.avatar_url) {
      setUrlImgPreview(null);
    }
  }, [userData?.avatar_url]);

  return (
    <>
      <Card.Body style={{ position: "relative" }}>
        {/* icona moodifica immagine */}
        {isMyProfile ? (
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
        ) : null}

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
          style={{ objectFit: "cover", border: "1px solid red" }}
          src={urlImgPreview || displayedUser?.avatar_url || defaultAvatarUrl}
          // se errore carica avatar default
          onError={(e) => {
            e.currentTarget.onerror = null; // evita loop
            e.currentTarget.src = defaultAvatarUrl;
          }}
        />

        {/* pulsantti gestione nuova immagine */}
        <ButtonGroup
          style={{
            display: `${imgUpload ? "block" : "none"}`,
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
    </>
  );
}
