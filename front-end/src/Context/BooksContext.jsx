//----- Componenti react
import { createContext, useState } from "react";

// contesto di autenticazione
export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const categoryList = ["fantasy", "history", "horror", "romance", "scifi"];
  const [category, setCategory] = useState(null);

  return (
    <BooksContext.Provider value={{ category, setCategory, categoryList }}>
      {children}
    </BooksContext.Provider>
  );
};
