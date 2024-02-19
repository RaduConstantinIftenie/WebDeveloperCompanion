import { Button } from "antd";
import { Filter } from "../../../../core/types/preferenceApiTypes";
import styles from "./FilterCard.module.scss";

const { container } = styles;

export const FilterCard = ({ filter }: { filter: Filter }) => {
  return (
    <div className={container}>
      <p>{filter?.target}</p>
      <p>{filter?.operationType}</p>
      <p>{filter?.operationValue}</p>
      <p>{filter?.sortOrder}</p>
      <div>
        <Button type="primary" shape="round">Edit</Button>
        <Button type="primary"  shape="round" danger>
          Delete
        </Button>
      </div>
    </div>
  );
};
