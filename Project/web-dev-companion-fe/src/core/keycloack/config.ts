import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://52.17.196.216:8080/auth",
  realm: "wed",
  clientId: "wed",
});

export default keycloak;
