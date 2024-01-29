import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home/Home";
import { useEffect } from "react";
import Sec from "../../pages/Sec/Sec";

export const AppRouter = () => {
  const { initialized, keycloak } = useKeycloak();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          {keycloak.authenticated && <Route path="/sec" Component={Sec} />}
        </Routes>
      </Router>
    </>
  );
};
