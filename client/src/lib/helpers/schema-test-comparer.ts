import { TestContext } from 'yup';
import { ComparisonOperatorValues } from '../types/types';
import { compareValues } from './compareValues';

export type SchemaTestComparerArgs<T, K = keyof T> = {
  compareWith: K;
  comparisonOperator: ComparisonOperatorValues;
};
export const schemaTestComparer = <T, K = keyof T>({ compareWith, comparisonOperator }: SchemaTestComparerArgs<T, K>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (this: TestContext<T>, value: any) {
    const relatedValue = this.parent[compareWith];
    return typeof value === typeof relatedValue && compareValues(value, relatedValue, comparisonOperator);
  };
