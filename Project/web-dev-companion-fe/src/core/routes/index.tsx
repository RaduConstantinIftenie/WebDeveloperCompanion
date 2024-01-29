import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "../../pages/Home/Home";
import Sec from "../../pages/Sec/Sec";

export const AppRouter = () => {
  const { keycloak } = useKeycloak();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/profile" element={<div>Hi</div>} />
          {keycloak.authenticated && <Route path="/sec" Component={Sec} />}
        </Routes>
      </Router>
    </>
  );
};
