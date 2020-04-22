/**
 * Context for creating new service factories.
 */
import { ServiceFactory, ServiceTag, SF } from '../ServiceFactory';
import { once } from '../lib';
import { ServiceFunctionReferenceContainer } from '../Containerd/ServiceFunctionReferenceContainer';
import { TaggedServiceFactoryReference } from '../Value/TaggedServiceFactoryReference';
import { getCurrentContainer, getCurrentFeatureFactory, inCurrentContext } from './GlobalContext';
import { InternalServiceFactoryReference } from '../Value/InternalServiceFactoryReference';
import { ServiceFunctionReferenceContainerInterface } from '../Containerd/ServiceFunctionReferenceContainerInterface';
import { MergedTaggedServiceFunctionReference } from '../Value/MergedTaggedServiceFunctionReference';

export interface ReferenceContext {
  /**
   * Makes a service reference so they can be overridden or decorated when passed as return value
   * to the service factory.
   *
   * @example
   *    const sf = ({reference}) => {
   *      const someService = reference(() => 'hi!');
   *      return {someService, otherService: () => someService() }
   *    }
   *
   * Now someService can be overridden, the service in otherService also overridden.
   */
  reference<S>(sf: ServiceFactory<S>): ServiceFactory<S>;
}

export const SERVICE_REFERENCE = Symbol.for('SERVICE_REFERENCE');

export const asReference = <T>(sf: SF<T>): SF<T> => {
  let factory: SF<T> = once(sf);
  const result: any = () => factory();
  /**
   * Only used when services not called by container factory.
   */
  if (!inCurrentContext()) {
    return result;
  }
  const currentContainer = getCurrentContainer();
  /**
   * Multiple dependency can reference this internal dependency.
   */
  const referencedDependency = new InternalServiceFactoryReference({
    factory: sf,
    feature: getCurrentFeatureFactory(),
  });

  factory = currentContainer.add(referencedDependency);
  /**
   * When the service factory is returned by a SF, this function will be called.
   */
  result[SERVICE_REFERENCE] = (builder: ServiceFunctionReferenceContainer, tag: ServiceTag) => {
    const dependency = new TaggedServiceFactoryReference({
      tag,
      factory,
      feature: getCurrentFeatureFactory(),
    });
    referencedDependency.addReferenceProxy(dependency);
    factory = builder.add(dependency);
  };
  return result;
};

export const asMergeReference = <T>(reference: () => TaggedServiceFactoryReference): SF<T> => {
  const result: any = () => {
    return reference().getProxy()();
  };
  result[SERVICE_REFERENCE] = (builder: ServiceFunctionReferenceContainer, tag: ServiceTag) => {
    const dependency = new MergedTaggedServiceFunctionReference(
      reference(),
      tag,
      getCurrentFeatureFactory(),
    );
    /**
     * Does this re-assignment have any use?
     */
    builder.add(dependency);
  };
  return result;
};

export const isServiceReferenced = (factory: any | SF<any>) => {
  return typeof factory[SERVICE_REFERENCE] === 'function';
};

export const handleServiceReferenced = <T>(builder: ServiceFunctionReferenceContainerInterface, factory: SF<T>, tag: ServiceTag): SF<T> => {
  return (factory as any)[SERVICE_REFERENCE](builder, tag);
};

export const wrapReturnAsReference: <T extends ((...args: any[]) => ServiceFactory<any>)>(toWrap: T) => T =
  ((toWrap: any) => (...args: any[]): ServiceFactory<any> => asReference(toWrap(...args))) as any;

export const createServiceFactoryReferenceContext = (): ReferenceContext => ({
  reference: asReference,
});
