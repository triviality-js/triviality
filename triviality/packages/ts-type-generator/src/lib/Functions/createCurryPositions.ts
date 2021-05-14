import {countCurry} from "./countCurry";
import {range} from "ramda";
import {CurryPositions} from "../CurryPositions";

export function createCurryPositions(length: number, maxCurry: number) {
  const binaries: CurryPositions[] = [];
  const total = Math.pow(2, length);
  let current = 0;
  for (let i = 0; i < total; i++) {
    binaries.push(new CurryPositions(length, current));
    current += 1;
  }
  return binaries.sort((a, b) => {
    const ca =  countCurry(length, a);
    const cb = countCurry(length, b);
    if (ca === cb) {
      return 0;
    }
    return ca > cb ? 1 : -1;
  }).slice(0, maxCurry);
}
