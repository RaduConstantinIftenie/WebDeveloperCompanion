import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "../../pages/Home/Home";
import Sec from "../../pages/Sec/Sec";
import { Preferences } from "../../pages/Preferences/Preferences";
import { Query } from "../../pages/Query/Query";

export const AppRouter = () => {
  const { keycloak } = useKeycloak();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/profile" element={<div>Hi</div>} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/query" element={<Query />} />
          {keycloak.authenticated && <Route path="/sec" Component={Sec} />}
        </Routes>
      </Router>
    </>
  );
};
