//----- Componenti react
import { useState } from "react";
//----- Componenti react-bootstrap
import { Card } from "react-bootstrap";
// ----- Componenti app
import UserDataView from "./UserDataView";
import UserDataUpdateComponent from "./UserDataUpdateComponent.jsx";

export default function UpdateUserData({ isMyProfile, displayedUser, setTriggerToast }) {
  //stato se modalità editing
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Card.Body
        style={{
          border: "1px solid #ccc",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        {isEditing ? (
          <>
            <UserDataUpdateComponent
              displayedUser={displayedUser}
              setIsEditing={setIsEditing}
              setTriggerToast={setTriggerToast}
            />
          </>
        ) : (
          <>
            <UserDataView
              isMyProfile={isMyProfile}
              displayedUser={displayedUser}
              setIsEditing={setIsEditing}
            />
          </>
        )}
      </Card.Body>
    </>
  );
}
