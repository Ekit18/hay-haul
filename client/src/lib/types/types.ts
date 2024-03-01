import { SortOrder } from '../enums/sort-order.enum';

export type ValueOf<T> = T[keyof T];
export type SortOrderValues = ValueOf<typeof SortOrder>;
