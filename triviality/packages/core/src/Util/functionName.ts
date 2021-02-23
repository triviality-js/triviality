import {isString} from "lodash";

export const functionName = (f: (...args: unknown[]) => unknown) => {
  if (isString(f.name) && f.name.length !== 0) {
    return f.name;
  }
  return null;
};
