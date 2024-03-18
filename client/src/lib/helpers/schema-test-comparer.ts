import { ComparisonOperatorValues } from '../types/types';

export type SchemaTestComparerArgs<T, K = keyof T> = {
  compareWith: K;
  comparisonOperator: ComparisonOperatorValues;
  message: string;
};
export const schemaTestComparer = <T, K = keyof T>({
  compareWith,
  comparisonOperator,
  message
}: SchemaTestComparerArgs<T, K>) => {
  // todo: like in scalarComparer on backend
};
