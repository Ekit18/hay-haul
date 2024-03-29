import { ComparisonOperator } from '../enums/comparison-operator.enum';
import { EntityTitle } from '../enums/entity-title.enum';
import { SortOrder } from '../enums/sort-order.enum';

export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

export type SortOrderValues = ValueOf<typeof SortOrder>;
export type ComparisonOperatorValues = ValueOf<typeof ComparisonOperator>;

export type Range<T> = { from?: Optional<T>; to?: Optional<T> };
export type RequiredRange<T> = { from: T; to: T };

export type DataWithCount<T> = {
  data: T[];
  count: number;
};

export type NumberRange = Range<number>;
export type DateRange = Range<Date>;
export type RequiredDateRange = RequiredRange<Date>;

export type NonTypeKeys<T, V> = {
  [K in keyof T]: Exclude<T[K], undefined> extends V ? never : K;
}[keyof T];

export type IfArray<T, U> = T extends Array<U> ? U : never;
export type IfRange<T, U> = T extends Range<U> | RequiredRange<U> ? T : never;

export type ArrayFields<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: IfArray<T[K], any>;
};

export type RangeFields<T, U> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: IfRange<T[K], U>;
};

export type NumberRangeFields<T> = RangeFields<T, number>;
export type DateRangeFields<T> = RangeFields<T, Date>;

export type ScalarFields<T, U> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends U ? T[K] : never;
};

export type DateFields<T> = ScalarFields<T, Date>;

export type EntityTitleValues = ValueOf<typeof EntityTitle>;

export type EmptyCallback = () => void;

export type UpdateRequestDto<T> = {
  body: T;
  id: string;
};
