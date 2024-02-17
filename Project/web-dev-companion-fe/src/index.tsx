import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./core/keycloack/config";
import { AppRouter } from "./core/routes";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ReactKeycloakProvider authClient={keycloak} autoRefreshToken={true}>
    <App>
      <AppRouter />
    </App>
  </ReactKeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
