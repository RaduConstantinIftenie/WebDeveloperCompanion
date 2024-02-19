import React, { useEffect, useState } from "react";
import { Content, Header } from "antd/es/layout/layout";
import Search from "antd/es/input/Search";
import Sider from "antd/es/layout/Sider";
import { useKeycloak } from "@react-keycloak/web";

import styles from "./App.module.scss";
import {
  Avatar,
  ConfigProvider,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Space,
  theme,
} from "antd";
import { ProfileMenuItems } from "./core/enums";
import { useStore } from "./core/hooks/useGlobalStore";
import { jwtDecode } from "jwt-decode";
import { Profile } from "./core/types/globalStore";
import { SideBar } from "./components";

const { defaultAlgorithm, darkAlgorithm } = theme;
const {
  header,
  brand,
  menuContainer,
  profile,
  profileButton,
  search,
  sideMenu,
  contentContainer,
} = styles;

// const sideMenuItems: MenuProps["items"] = [
//   {
//     key: 0,
//     label: "Favorites",
//     type: "group",
//     children: [
//       {
//         key: 0,
//         label: "Item 1",
//       },
//       {
//         key: 1,
//         label: "Item 2",
//       },
//     ],
//   },
// ];

const App: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { keycloak, initialized } = useKeycloak();
  const { setState } = useStore();

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login();
    }

    if (!keycloak.token) {
      return;
    }

    const decoded = jwtDecode(keycloak.token as string) as Profile;

    const { user_id, email, realm_access } = decoded;
    setState({
      idToken: keycloak.idToken,
      accessToken: keycloak.token,
      profile: {
        user_id,
        email,
        realm_access,
      },
    });

    localStorage.setItem("token", keycloak.token);

    console.log(keycloak.token);
  }, [initialized, keycloak.idToken, keycloak.token, setState]);

  const items: MenuProps["items"] = [
    {
      label: <a href="/profile">Profile</a>,
      key: ProfileMenuItems.Profile,
    },
    {
      label: isDarkMode ? "Light Mode" : "Dark Mode",
      key: ProfileMenuItems.DarkMode,
    },
    {
      type: "divider",
    },
    {
      label: "Log out",
      key: ProfileMenuItems.Logout,
      onClick: () => keycloak.logout(),
    },
  ];

  const handleMenuSelect = ({ key }: { key: string }) => {
    switch (key) {
      case ProfileMenuItems.DarkMode:
        setIsDarkMode((previousValue) => !previousValue);
        break;
      case ProfileMenuItems.Logout:
        break;
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Layout>
        <Header id={header}>
          <div className={brand}>Web Developer Companion</div>

          <Dropdown
            className={profile}
            menu={{
              onClick: handleMenuSelect,
              items,
            }}
            trigger={["click"]}
          >
            <button className={profileButton}>
              <Space>
                <Avatar
                  style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                  size="large"
                >
                  U
                </Avatar>
              </Space>
            </button>
          </Dropdown>
        </Header>

        <Layout>
          <SideBar />

          <Content className={contentContainer}>{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
