import TextArea from "antd/es/input/TextArea";
import styles from "./Query.module.scss";
import { Button, Table } from "antd";
import { useState } from "react";
import { queryRdfDb } from "../../api/sparkApi";
import { useStore } from "../../core/hooks/useGlobalStore";
import { tableHead } from "./utils/tableHead";
import { RdfData } from "../../core/types/sparkApiTypes";

const { queryContainer, button, filter } = styles;

export const Query = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState({} as RdfData);
  const [isLoading, setIsLoading] = useState(true);
  const {
    state: { profile },
  } = useStore();

  const handleOnSubmit = async () => {
    const resp = await queryRdfDb({
      userId: profile?.user_id as string,
      query,
    });
    setData((_) => resp);
    console.log("resp: ", resp);
    setIsLoading(false);
  };

  const getDataSource = () =>
    data.results.bindings.map((entry, index) => ({
      key: `spo-${index}`,
      s: entry.s.value,
      p: entry.p.value,
      o: entry.o.value,
    }));

  return (
    <>
      <div className={queryContainer}>
        <h1>Write your own query</h1>
        <div className={filter}>
          <TextArea
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="primary"
            className={button}
            size="large"
            onClick={handleOnSubmit}
          >
            Submit
          </Button>
        </div>

        {!isLoading && (
          <Table
            dataSource={getDataSource()}
            columns={tableHead}
            scroll={{ y: "50" }}
          />
        )}
      </div>
    </>
  );
};
