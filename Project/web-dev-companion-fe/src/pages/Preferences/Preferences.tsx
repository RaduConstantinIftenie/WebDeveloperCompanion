import { Button, Table, Tooltip } from "antd";
import { AddForm } from "./components/AddForm/AddForm";
import { useEffect, useState } from "react";
import styles from "./Preferences.module.scss";
import { deletePreferences, getPreferences } from "../../api/preferencesApi";
import { useStore } from "../../core/hooks/useGlobalStore";
import {
  Filter,
  Preferences as PreferencesType,
} from "../../core/types/preferenceApiTypes";
import { useKeycloak } from "@react-keycloak/web";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { tableHead } from "./components/utils/tableHead";

const { buttonRow, container, table, iconButton } = styles;

export const Preferences = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { keycloak } = useKeycloak();

  const {
    state: { profile },
  } = useStore();
  const [preferences, setPreferences] = useState({} as PreferencesType);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!keycloak.authenticated) {
      console.log(profile?.user_id);
      return;
    }

    async function fetchData() {
      const response = await getPreferences(profile?.user_id as string);
      setPreferences(response);
      setIsLoading((prev) => false);
    }
    fetchData();
  }, [profile?.user_id]);

  const handleOnDelete = async (id: string) => {
    await deletePreferences(profile?.user_id as string, [id]);
    setPreferences((prev) => ({
      filters: prev.filters.filter((x) => x.id !== id),
    }));
  };

  const getDataSource = () => {
    return preferences?.filters?.map((filter, index) => {
      const { id, target, sortOrder, operationValue, operationType } = filter;

      return {
        key: id,
        target,
        operationType,
        operationValue,
        sortOrder,
        actions: (
          <>
            <Tooltip title="Edit">
              <Button
                className={iconButton}
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                className={iconButton}
                type="primary"
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleOnDelete(id as string)}
              />
            </Tooltip>
          </>
        ),
      };
    });
  };

  const addFilter = (filter: Filter) => {
    setPreferences((prev) => ({
      filters: [...prev.filters, filter],
    }));
  };

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

        {!isLoading && (
          <Table
            className={table}
            dataSource={getDataSource()}
            columns={tableHead}
          />
        )}
      </div>

      <AddForm
        isOpened={isModalOpened}
        setIsOpened={setIsModalOpened}
        addFilter={addFilter}
      />
    </>
  );
};
