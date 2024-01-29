import React, { useState } from "react";
import { Content, Header } from "antd/es/layout/layout";
import Search from "antd/es/input/Search";
import Sider from "antd/es/layout/Sider";

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

const sideMenuItems: MenuProps["items"] = [
  {
    key: 0,
    label: "Favorites",
    type: "group",
    children: [
      {
        key: 0,
        label: "Item 1",
      },
      {
        key: 1,
        label: "Item 2",
      },
    ],
  },
];

const App: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

          <div className={menuContainer}>
            <Search
              className={search}
              placeholder="Search..."
              loading={false}
              enterButton
            />
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
          </div>
        </Header>

        <Layout>
          <Sider>
            <Menu
              className={sideMenu}
              theme={isDarkMode ? "dark" : "light"}
              mode="vertical"
              items={sideMenuItems}
            />
          </Sider>

          <Content className={contentContainer}>{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
