import { keys } from 'lodash/fp';
import { ServicesAsFactories, SF } from '../ServiceFactory';

/**
 * Context for overriding services.
 */
export interface OverrideContext<TDependencies> {
  readonly override: Overrides<TDependencies>;
}

export const createFeatureFactoryOverrideContext = <TDependencies>(dependencies: () => ServicesAsFactories<TDependencies>): OverrideContext<TDependencies> => {
  return ({
    get override() {
      const overrides = {};
      for (const key of keys(dependencies())) {
        Object.defineProperty(overrides, key, {
          get: ((overrideWith: OverrideWith<any>) => {
            return {
              [key]: overrideWith
            }
          }) as any,
        });
      }
      return overrides as any;
    },
  });
};

export type OverrideWith<T> = (original: SF<T>) => T;
export type OverrideFunction<T, K extends keyof T> = (overrideWith: OverrideWith<T[K]>) => Record<K, OverrideWith<T[K]>>;

export type Overrides<T> = {
  [K in keyof T]: OverrideFunction<T, K>;
};
