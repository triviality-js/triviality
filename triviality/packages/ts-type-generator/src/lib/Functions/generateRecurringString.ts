import {curry, range} from "ramda";

export const generateRecurringString =
  curry((total: number, empty: boolean, createString: (nr: number) => string, separator: string) => range(empty ? 0 : 1, total + 1).map(createString).join(separator));

