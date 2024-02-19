import { Button } from "antd";
import { AddForm } from "./components/AddForm/AddForm";
import { useState } from "react";
import styles from "./Preferences.module.scss";

const { buttonRow, container } = styles;

export const Preferences = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  return (
    <>
      <h1>Preferences</h1>
      <div className={container}>
        <div className={buttonRow}>
          <Button
            type="primary"
            size="large"
            onClick={() => setIsModalOpened((prev) => !prev)}
          >
            Add preference
          </Button>
        </div>
      </div>

      <AddForm isOpened={isModalOpened} setIsOpened={setIsModalOpened}/>
    </>
  );
};
