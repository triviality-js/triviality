import {CurryPositions} from "../CurryPositions";

export function countCurry(length: number, binary: CurryPositions) {
  return curryIndexes(length, binary).length;
}


export function curryIndexes(length: number, binary: CurryPositions) {
  const argsLeft: number[] = [];
  for (let i = 1; i <= length; i++) {
    if (binary.atPos(i)) {
      argsLeft.push(i);
    }
  }
  return argsLeft;
}


/**
 *         |
 *         V
 * 11111000111
 *
 *
 * 111
 *
 * @param binary
 * @param index
 */
export function isAtTheEnd(binary: CurryPositions, index: number) {
  for (let i = index; i <= binary.length; i++) {
    if (!binary.atPos(i)) {
      return false;
    }
  }
  return true;
}
