import { Form, Input, Modal, Select, DatePicker } from "antd";
import styles from "./AddForm.module.scss";
import {
  OperationTypes,
  RdfSources,
  SortingTypes,
} from "../../../../core/enums";
import { useState } from "react";
import { RangeValue } from "rc-picker/lib/interface";
import dayjs from "dayjs";
import { addPreferences } from "../../../../api/preferencesApi";
import { useKeycloak } from "@react-keycloak/web";
import { useStore } from "../../../../core/hooks/useGlobalStore";

const { RangePicker } = DatePicker;
const { form, datePicker } = styles;

export const AddForm = ({
  isOpened,
  setIsOpened,
}: {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const targets = Object.keys(RdfSources);
  const sortingTypes = Object.keys(SortingTypes);
  const [formData, setFormData] = useState<{
    target: RdfSources;
    operationType: OperationTypes;
    operationValue: string;
    sortOrder: SortingTypes;
    startDate?: string;
    endDate?: string;
  }>({
    target: RdfSources.ID,
    operationType: OperationTypes.EQUALS,
    sortOrder: SortingTypes.ASC,
    operationValue: "",
    startDate: "",
    endDate: "",
  });
  const {
    state: { profile },
  } = useStore();

  const handleOnChange = (fieldName: string, value: string) => {
    let operationType = formData.operationType;

    if (fieldName === "target") {
      switch (value) {
        case RdfSources.ID:
          operationType = OperationTypes.EQUALS;
          break;
        case RdfSources.CREATED_DATE:
          operationType = OperationTypes.DATE_IN_RANGE;
          break;
        default:
          operationType = OperationTypes.CONTAINS;
          break;
      }
    }

    setFormData((prev) => ({
      ...prev,
      operationType,
      [fieldName]: value,
    }));
  };

  const handleDateChange = (event: RangeValue<dayjs.Dayjs>) => {
    setFormData((prev) => ({
      ...prev,
      startDate: event?.[0]?.format("YYYY-MM-DD"),
      endDate: event?.[1]?.format("YYYY-MM-DD"),
    }));
  };

  const handleOnOk = async () => {
    console.log(formData);
    console.log(profile?.user_id);
    const {
      operationType,
      target,
      sortOrder,
      startDate,
      endDate,
      operationValue,
    } = formData;

    const userId = profile?.user_id as string;
    await addPreferences(userId, {
      filters: [
        {
          userId,
          operationType,
          sortOrder,
          target,
          operationValue: target === RdfSources.CREATED_DATE
            ? `${startDate},${endDate}`
            : operationValue,
        },
      ],
    });
  };

  const generateOperationTypeOptions = () => {
    if (formData.target === RdfSources.ID) {
      return (
        <Select.Option value={OperationTypes.EQUALS}>
          {OperationTypes.EQUALS}
        </Select.Option>
      );
    }

    if (formData.target === RdfSources.CREATED_DATE) {
      return (
        <Select.Option value={OperationTypes.DATE_IN_RANGE}>
          {OperationTypes.DATE_IN_RANGE}
        </Select.Option>
      );
    }

    return (
      <>
        <Select.Option value={OperationTypes.EQUALS}>
          {OperationTypes.EQUALS}
        </Select.Option>
        <Select.Option value={OperationTypes.CONTAINS}>
          {OperationTypes.CONTAINS}
        </Select.Option>
      </>
    );
  };

  return (
    <Modal
      title="Add preference"
      open={isOpened}
      onOk={handleOnOk}
      onCancel={() => setIsOpened((prev) => !prev)}
    >
      <Form layout="vertical" className={form}>
        <Form.Item label="Target">
          <Select
            defaultValue={formData.target}
            value={formData.target}
            onChange={(value) => handleOnChange("target", value)}
          >
            {targets.map((target, index) => (
              <Select.Option key={`${target}-${index}`} value={target}>
                {target}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Operation type">
          <Select
            defaultValue={formData.operationType}
            value={formData.operationType}
            onChange={(value) => handleOnChange("operationType", value)}
          >
            {generateOperationTypeOptions()}
          </Select>
        </Form.Item>

        <Form.Item label="Sorting Order">
          <Select
            defaultValue={formData.sortOrder}
            value={formData.sortOrder}
            onChange={(value) => handleOnChange("sortOrder", value)}
          >
            {sortingTypes.map((type, index) => (
              <Select.Option key={`${type}-${index}`} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {formData.target === RdfSources.CREATED_DATE ? (
          <Form.Item label="Operation value">
            <RangePicker
              className={datePicker}
              format="YYYY-MM-DD"
              onChange={handleDateChange}
            />
          </Form.Item>
        ) : (
          <Form.Item label="Operation value">
            <Input
              value={formData.operationValue}
              onChange={(e) => handleOnChange("operationValue", e.target.value)}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
