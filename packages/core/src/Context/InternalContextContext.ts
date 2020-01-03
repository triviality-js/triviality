import type { ServiceFunctionReferenceContainerInterface } from '../Container/ServiceFunctionReferenceContainerInterface';

// tslint:disable-next-line
import type { invokeFeatureFactory } from '../invokeFeatureFactory';

/**
 * Context for the context, not exposed to the outside world.
 *
 * All dependencies for all nested context functions.
 *
 * TODO: change naming?
 */
export interface InternalContextContext {
  container: ServiceFunctionReferenceContainerInterface;
  invoke: typeof invokeFeatureFactory;
}
