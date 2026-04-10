export const optional = function<Value>(
    value: Value | undefined,
    defaultValue: Value,
): Value {
  if (typeof value === 'undefined') {
    return defaultValue;
  }
  return value;
};
