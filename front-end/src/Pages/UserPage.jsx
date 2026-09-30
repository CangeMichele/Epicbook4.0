// ----- Componenti react
import { useContext, useEffect, useState } from "react";
// ----- Componenti context
import { AuthContext } from "../Context/AuthContext";
//----- Componenti react-router-dom
import { useParams, useNavigate } from "react-router-dom";
//----- Componenti react-bootstrap
import { Col, Row, Card, Alert, Toast } from "react-bootstrap";
// ----- Componenti app
import AvatarComponents from "../Components/userpage/AvatarComponents";
import UserDataComponents from "../Components/userpage/UserDataComponents";
// ---- API
import { getUsersByParams } from "../api/apiUsers";

export default function UserPage() {
  //recupero dati utente dal context
  const { userLogged } = useContext(AuthContext);

  //recupero nome utente dal params
  const params = useParams();
  const userInParams = params.user;

  //navigatore
  const navigate = useNavigate();

  //stato dati utente da visulaizzare
  const [profileData, setProfileData] = useState(null);

  //stato attiva/chiudi toast errore
  const [triggerToast, setTriggerToast] = useState(false);

  //stato utente trovato
  const [isUserFound, setIsUserFound] = useState(true);

  //valore di controllo se utente loggato
  const isMyProfile = Boolean(
    userLogged &&
    userLogged.userName?.toLowerCase() === userInParams.toLocaleLowerCase(),
  );

  //dati da visualizzare
  const displayedUser = isMyProfile ? userLogged : profileData;

  //estrapolazione dati utente
  useEffect(() => {
    
    if (!isMyProfile) {
      const fetchProfileData = async () => {
        try {
          const response = await getUsersByParams({ userName: userInParams });          

          if (response.data?.length === 0) {
            setIsUserFound(false);
          } else {
            setProfileData(response.data[0]);
          }
        } catch (error) {
          console.log("error: ", error);
          setTriggerToast(true);
          setIsUserFoud(false);
        }
      };
      fetchProfileData();
    }
  }, [userLogged, userInParams]);

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

      {!isUserFound ? (
        <Alert className="text-center">
          <h1>Utente inesistente</h1>
          <h3>riprova</h3>
        </Alert>
      ) : (
        <Card
          style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.1)", padding: "20px" }}
        >
          <Row>
            <Col md="4">
              <AvatarComponents
                setTriggerToast={setTriggerToast}
                isMyProfile={isMyProfile}
                displayedUser={displayedUser}
              />
            </Col>

            <Col md="8">
              <UserDataComponents
                setTriggerToast={setTriggerToast}
                isMyProfile={isMyProfile}
                displayedUser={displayedUser}
              />
            </Col>
          </Row>
        </Card>
      )}
    </>
  );
}
