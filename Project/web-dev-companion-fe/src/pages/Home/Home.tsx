import { useKeycloak } from "@react-keycloak/web";
import { Link } from "react-router-dom";
import { useStore } from "../../core/hooks/useGlobalStore";

const Home: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();
  const {
    state: { profile },
  } = useStore();

  console.log(profile);

  return (
    <>
      <Link to="/sec">To sec</Link>
    </>
  );
};

export default Home;
