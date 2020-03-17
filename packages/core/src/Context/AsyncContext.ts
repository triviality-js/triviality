/**
 * Context helper for using async services.
 */
import { SF } from '../ServiceFactory';
import { wrapReturnAsReference } from './ReferenceContext';
import { InternalContextContext } from './InternalContextContext';
import { AsyncServiceFunctionReference } from '../Value/AsyncServiceFunctionReference';
import { getCurrentFeatureFactory } from './GlobalContext';

export interface AsyncContext {
  /**
   * Convert async service factory to sync service factory.
   */
  synchronize<T>(sf: () => Promise<T>): SF<T>;
}

export const createFeatureFactoryAsyncContext = ({ container }: InternalContextContext): AsyncContext => ({
  synchronize: wrapReturnAsReference(<T extends SF>(sf: () => Promise<T>): T => {
    return container.add(new AsyncServiceFunctionReference(sf, getCurrentFeatureFactory())) as any;
  }) as any,
});
