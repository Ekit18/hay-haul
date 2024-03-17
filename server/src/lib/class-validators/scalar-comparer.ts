import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { ComparisonOperator } from '../enums/enums';
import { compareValues } from '../helpers/compareValues';

export function ScalarComparer<T>(
  property: keyof T,
  validationOptions?: ValidationOptions & { operator: ComparisonOperator },
) {
  return function (object: T, propertyName: keyof T) {
    registerDecorator({
      name: 'ScalarComparer',
      target: object.constructor,
      propertyName: propertyName as string,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];
          return (
            typeof value === typeof relatedValue &&
            compareValues(value, relatedValue, validationOptions.operator)
          );
        },
      },
    });
  };
}
