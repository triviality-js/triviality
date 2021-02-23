import {match} from "ramda";
import {EOL} from "os";
import os from "os";

export const matchEmptyOrStatement = () => /(.*; *$|^ *$)/;
export const findTextToRemove = (text: string, matches: RegExp) => {
  const removed: string[] = [];
  const lines = text.split(os.EOL);
  for (const line of lines) {
    if (matches.test(line)) {
      removed.push(line);
    } else {
      break;
    }
  }
  return removed.join(os.EOL);
}
