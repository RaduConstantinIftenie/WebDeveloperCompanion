import { OperationTypes, RdfSources, SortingTypes } from "../enums";

export type Preferences = {
  filters: Filter[];
};

export type Filter = {
  id?: string;
  userId: string;
  target: RdfSources;
  operationType: OperationTypes;
  operationValue: string;
  sortOrder: SortingTypes;
};
