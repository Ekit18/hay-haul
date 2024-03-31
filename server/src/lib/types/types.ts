export type ValueOf<T> = T[keyof T];

export type FirstParameter<T> = T extends (
  ..._arguments: [infer Parameter, ...infer Rest]
) => unknown
  ? Parameter
  : never;
