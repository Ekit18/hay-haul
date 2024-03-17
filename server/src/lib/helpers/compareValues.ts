import { ComparisonOperator } from '../enums/enums';

export const compareValues = <T>(
  value1: T,
  value2: T,
  comparisonOperator: ComparisonOperator,
): boolean => {
  switch (comparisonOperator) {
    case ComparisonOperator.EQUAL:
      return value1 === value2;
    case ComparisonOperator.NOT_EQUAL:
      return value1 !== value2;
    case ComparisonOperator.GREATER_THAN:
      return value1 > value2;
    case ComparisonOperator.GREATER_THAN_OR_EQUAL:
      return value1 >= value2;
    case ComparisonOperator.LESS_THAN:
      return value1 < value2;
    case ComparisonOperator.LESS_THAN_OR_EQUAL:
      return value1 <= value2;
    default:
      return false;
  }
};
