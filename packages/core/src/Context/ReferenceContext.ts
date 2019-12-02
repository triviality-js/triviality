/**
 * Context for creating new service factories.
 */
import { ServiceFactory, ServiceTag, SF } from '../ServiceFactory';
import { MutableContainer } from '../Container';
import { getCurrentContext, inCurrentContext } from './GlobalContext';
import { once, watchCallStack } from '../lib';

export interface ReferenceContext {
  /**
   * Makes services reference so they can be overridden or decorated.
   */
  reference<S>(sf: ServiceFactory<S>): ServiceFactory<S>;
}

const SF_REFERENCES = Symbol.for('SF_REFERENCES');

interface ServiceReference<T = unknown> {
  target: SF<T>;
  reference: SF<T>;
}

export interface PrivateFeatureFactoryReferenceContext {
  [SF_REFERENCES]: Map<SF, ServiceReference>;
}

const getReferenced = (): Map<SF, ServiceReference> => getCurrentContext<{}, PrivateFeatureFactoryReferenceContext>()[SF_REFERENCES];

export const postFeatureFactoryContext = (services: Array<[ServiceTag, SF]>, container: MutableContainer) => {
  const references = getReferenced();
  services.forEach((ref: any) => {
    const [tag, sf] = ref;
    const reference = references.get(sf);
    if (!reference) {
      return;
    }
    container.setService(tag, reference.target);
    reference.target = container.getService(tag);
    references.delete(sf);
    services.splice(services.indexOf(ref), 1);
  });
};

export const asReference = <T>(sf: SF<T>): ServiceFactory<T> => {
  const memorized: SF<T> = watchCallStack('asReference')<SF<T>, T>(once(sf));
  if (!inCurrentContext()) {
    return memorized;
  }
  const reference: ServiceReference<T> = {
    reference: () => reference.target(),
    target: memorized,
  };
  const context = getCurrentContext<{}, PrivateFeatureFactoryReferenceContext>();
  context[SF_REFERENCES].set(reference.reference, reference);
  return reference.reference;
};

export const getCurrentReference = <S>(sf: ServiceFactory<S>): ServiceFactory<S> => {
  const references = getReferenced();
  const reference = references.get(sf);
  if (!reference) {
    return sf;
  }
  return reference.target as any;
};

export const wrapReturnAsReference: <T extends ((...args: any[]) => ServiceFactory<any>)>(toWrap: T) => T =
  ((toWrap: any) => (...args: any[]): ServiceFactory<any> => asReference(toWrap(...args))) as any;

export const createServiceFactoryReferenceContext = (_container: MutableContainer): ReferenceContext & PrivateFeatureFactoryReferenceContext => ({
  reference: asReference,
  [SF_REFERENCES]: new Map(),
});
