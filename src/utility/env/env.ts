export const env = (key: string, defaultValue: string): string => {
  const value = process.env[key.toUpperCase()];
  if (typeof value === "undefined") {
    return defaultValue;
  }
  return value;
};
