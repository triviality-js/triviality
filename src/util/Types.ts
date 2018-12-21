export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Make all properties in T optional
 */
export type Optional<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Should not define these properties for this type.
 */
export type NoDuplicates<T> = {
  [P in keyof T]?: never;
};
