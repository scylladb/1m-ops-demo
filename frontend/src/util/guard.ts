export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const objectHasProperty = <
  K extends string,
  T extends Record<K, unknown>,
>(
  object: Readonly<Record<string, unknown>> | T,
  property: string
): object is { [K in keyof T]: unknown } => property in object;

export const allRecordValuesAreStrings = (
  record: Readonly<Record<string, unknown>>
): record is Readonly<Record<string, string>> =>
  Object.values(record).every((value) => typeof value === 'string');
