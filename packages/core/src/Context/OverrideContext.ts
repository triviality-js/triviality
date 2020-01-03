import { curry, fromPairs } from 'ramda';
import { ServiceTag } from '../ServiceFactory';
import { ServiceFunctionReferenceContainerInterface } from '../Container/ServiceFunctionReferenceContainerInterface';

/**
 * Context for overriding services.
 */
export interface OverrideContext<T> {
  override: Overrides<T>;
}

export const createFeatureFactoryOverrideContext = (container: ServiceFunctionReferenceContainerInterface): OverrideContext<any> => ({
  override: fromPairs(
    container.references().taggedPairs().map(([serviceName]) => [serviceName, overrideBy(container, serviceName)])),
});

type OverrideWith<T> = (original: T) => T;

export type Overrides<T> = {
  [K in keyof T]: (overrideWith: OverrideWith<T[K]>) => {};
};

export const overrideBy = curry(
  (container: ServiceFunctionReferenceContainerInterface, serviceTagToOverride: ServiceTag, overrideWith: OverrideWith<any>): {} => {
    container.override({
      tag: serviceTagToOverride,
      override: overrideWith,
    });
    return {};
  });
