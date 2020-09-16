/**
 * Context for creating new service factories.
 */
import {ServiceFactory} from "../ServiceFactory";
import {asServiceFactoryReference, ServiceFactoryReference} from "../ServiceFactoryReference";

export interface ServiceFactoryReferenceContext {
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
  reference<S>(sf: ServiceFactory<S>): ServiceFactoryReference<S>;
}

export const createServiceFactoryReferenceContext = (): ServiceFactoryReferenceContext => ({
  reference: asServiceFactoryReference,
});
