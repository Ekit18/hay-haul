import { ComparisonOperator } from '../enums/comparison-operator.enum';
import { EntityTitle } from '../enums/entity-title.enum';
import { SortOrder } from '../enums/sort-order.enum';

export type ValueOf<T> = T[keyof T];
export type SortOrderValues = ValueOf<typeof SortOrder>;
export type ComparisonOperatorValues = ValueOf<typeof ComparisonOperator>;

export type DataWithCount<T> = {
  data: T[];
  count: number;
};

export type IfArray<T, U> = T extends Array<U> ? U : never;

export type ArrayFields<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: IfArray<T[K], any>;
};

export type EntityTitleValues = ValueOf<typeof EntityTitle>;

export type EmptyCallback = () => void;

export type UpdateRequestDto<T> = {
  body: T;
  id: string;
};
