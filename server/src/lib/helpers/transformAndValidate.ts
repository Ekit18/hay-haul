import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export async function transformAndValidate<
  T extends ClassConstructor<object>,
  V,
  J extends object = T extends ClassConstructor<infer L> ? L : object,
>(value: V, targetClass: T): Promise<J> {
  const instance: J = plainToClass(targetClass, value) as J;

  await validate(instance, { forbidUnknownValues: true });
  return instance;
}
