//----- Componenti react
import { useEffect } from "react";
//----- Componenti react-router-dom
import { useLocation } from "react-router-dom";

const ToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disabilita l'animazione scroll
    document.documentElement.style.scrollBehavior = "auto";

    //Posizionamento a inizio pagina
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ToTop;
