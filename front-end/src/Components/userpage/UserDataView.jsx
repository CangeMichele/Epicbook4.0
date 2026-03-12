//----- Componenti react-bootstrap
import { Card, ListGroup } from "react-bootstrap";
// ----- Componenti Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function UserDataView({
  isMyProfile,
  displayedUser,
  setIsEditing,
}) {
  //-->  modifica dati
  const handleUpdateUserData = () => {
    setIsEditing(true);
  };

  return (
    <>
      {/* dati utente */}
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Card.Title>{displayedUser?.userName}</Card.Title>
        </ListGroup.Item>
        <ListGroup.Item>Nome: {displayedUser?.firstName}</ListGroup.Item>
        <ListGroup.Item>Cognome: {displayedUser?.lastName}</ListGroup.Item>
        <ListGroup.Item>
          Data di nascita:{" "}
          {displayedUser?.birthDate
            ? Intl.DateTimeFormat("it-IT").format(
                new Date(displayedUser.birthDate),
              )
            : ""}
        </ListGroup.Item>
        <ListGroup.Item>
          Data di iscrizione:{" "}
          {displayedUser?.createdAt
            ? Intl.DateTimeFormat("it-IT").format(
                new Date(displayedUser.createdAt),
              )
            : ""}
        </ListGroup.Item>
        <ListGroup.Item>Email: {displayedUser?.email}</ListGroup.Item>
      </ListGroup>

      {/* icona moodifica dati utente */}
      {isMyProfile ? (
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
          onClick={handleUpdateUserData}
        />
      ) : null}
    </>
  );
}
