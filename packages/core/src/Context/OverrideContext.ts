import { curry, fromPairs } from 'ramda';
import { ServiceTag, SF } from '../ServiceFactory';
import { ServiceFunctionReferenceContainerInterface } from '../Containerd/ServiceFunctionReferenceContainerInterface';

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

/**
 * TODO: original should be a function, so it's not always needed to execute service factory.
 */
type OverrideWith<T> = (original: SF<T>) => T;

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
