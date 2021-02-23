
export function countCurry(length: number, binary: number) {
  return curryIndexes(length, binary).length;
}


export function curryIndexes(length: number, binary: number) {
  const argsLeft: number[] = [];
  for (let i = 1; i <= length; i++) {
    if (binary & 1 << (i - 1)) {
      argsLeft.push(i);
    }
  }
  return argsLeft;
}
