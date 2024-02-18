import { useKeycloak } from "@react-keycloak/web";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();

  console.log(keycloak.authenticated);
  return (
    <>
      {!keycloak.authenticated ? (
        <button onClick={() => keycloak.login()}>Log In</button>
      ) : (
        <button onClick={() => keycloak.logout()}>Log out</button>
      )}

      <Link to="/sec">To sec</Link>
    </>
  );
};

export default Home;
