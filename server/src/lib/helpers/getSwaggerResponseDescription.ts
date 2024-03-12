export const getSwaggerResponseDescription = (...errors: string[]): string => {
  return errors.join(' | ');
};
