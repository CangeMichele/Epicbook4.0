//----- Componenti react
import { React, useState, useEffect } from "react";

//----- Componenti app
import CommentsList from "./CommentsList";
// import AddComment from "./AddComment";

//----- CommentArea.jsx
function CommentsArea({ asin }) {
  return (
    <>
      {/* <AddComment
        bookId={asin}
        updateListComment={updateListComment}
        setUpdateListComment={setUpdateListComment}
        token={token}
      /> */}

      <CommentsList
      asin={asin}
        // commentsBook={handleCommentsBook}
        // updateListComment={updateListComment}
        // setUpdateListComment={setUpdateListComment}
        // token={token}
      />
    </>
  );
}
export default CommentsArea;
