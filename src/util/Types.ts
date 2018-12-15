
export type Omit<T, K extends keyof T> = Pick<T, ({ [P in keyof T]: P } & { [P in K]: never } & { [x: string]: never, [x: number]: never })[keyof T]>;

/**
 * Make all properties in T optional
 */
export type Optional<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties in T optional
 */
export type NoDuplicates<T> = {
  [P in keyof T]?: never;
};
