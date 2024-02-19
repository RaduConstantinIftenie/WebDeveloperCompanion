import Sider from "antd/es/layout/Sider";
import styles from "./Sidebar.module.scss";

const { container } = styles;

export const SideBar = () => {
  return (
    <Sider id={container}>
      <h3>Menu</h3>
      <a href="/">Home</a>
      <a href="/preferences">Preferences</a>
      <a href="/query">Query</a>
    </Sider>
  );
};
