// ----- Componenti react
import { useContext, useEffect, useState } from "react";
// ----- Componenti context
import { AuthContext } from "../Context/AuthContext";
//----- Componenti react-router-dom
import { useParams, useNavigate } from "react-router-dom";
//----- Componenti react-bootstrap
import { Col, Row, Card} from "react-bootstrap";
// ----- Componenti app
import AvatarComponents from "../Components/userpage/AvatarComponents";
import UserDataComponents from "../Components/userpage/UserDataComponents";


export default function UserPage() {

  //recupero dati utente dal context
  const { userData } = useContext(AuthContext);

  //recupero nome utente dal params
  const params = useParams();
  const userInParams = params.user;

  //navigatore
  const navigate = useNavigate();

  //stato dati utente da visulaizzare
  const [profileData, setProfileData] = useState({});

  //valore di controllo se utente loggato
  const isMyProfile =
    userData &&
    userData.userName.toLowerCase() === userInParams.toLocaleLowerCase();

  //dati da visualizzare
  const displayedUser = isMyProfile ? userData : profileData;

  //estrapolazione dati utente
  useEffect(() => {
    if (!userData) return;

    if (!isMyProfile) {
      const fetchProfileData = async () => {
        try {
          const response = await getUsersByParams({ userName: userInParams });

          if (response.length === 0) {
            // navigate("/404");
            console.log("non trovato!");
            navigate("/404");
          } else {
            setProfileData(response[0]);
          }
        } catch (error) {
          alert("errore nella ricerca");
          navigate("/");
        }
      };
      fetchProfileData();
    }
  }, [userData, userInParams]);

  return (
    <>
      <Card style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.1)", padding: "20px" }}>
        <Row>
          <Col md="4">
            <AvatarComponents
              isMyProfile={isMyProfile}
              displayedUser={displayedUser}
            />
          </Col>
          
          <Col md="8">
          <UserDataComponents
            isMyProfile={isMyProfile}
            displayedUser={displayedUser}
          />
          </Col>
        </Row>
      </Card>
    </>
  );
}
