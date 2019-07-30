import { curry, fromPairs } from 'ramda';
import { MutableContainer } from '../Container';
import { InferServiceType, ServiceTag } from '../ServiceFactory';

/**
 * Context for overriding services.
 */
export interface FeatureFactoryOverrideContext<T> {
  override: Overrides<T>;
}

export const createFeatureFactoryOverrideContext = (container: MutableContainer): FeatureFactoryOverrideContext<any> => ({
  override: fromPairs(container.services().map(([serviceName]) => [serviceName, overrideBy(container, serviceName)])),
});

type OverrideWith<T> = (original: T) => T;

export type Overrides<T> = {
  [K in keyof T]: (overrideWith: OverrideWith<InferServiceType<T[K]>>) => {};
};

export const overrideBy = curry(
  (container: MutableContainer, serviceTagToOverride: ServiceTag, overrideWith: OverrideWith<any>): {} => {
    const { setService, getCurrentService } = container;
    const original = getCurrentService(serviceTagToOverride);
    setService(
      serviceTagToOverride,
      () => overrideWith(original()),
    );
    return {};
  });
