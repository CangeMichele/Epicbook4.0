//----- Componenti react
import { useState } from "react";
//----- Componenti react-bootstrap
import { Card } from "react-bootstrap";
// ----- Componenti app
import UserDataView from "./UserDataView";
import UserDataUpdate from "./UserDataUpdate";

export default function UpdateUserData({ isMyProfile, displayedUser }) {
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
            <UserDataUpdate
              displayedUser={displayedUser}
              setIsEditing={setIsEditing}
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
