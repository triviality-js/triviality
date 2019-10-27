import { fromPairs } from 'ramda';
import { FeatureFactory } from './FeatureFactory';
import { invokeFeatureFactories } from './invokeFeatureFactory';
import { ServiceContainer } from './ServiceContainer';
import { createMutableLockableContainer } from './container';
/**
 * Container factory.
 */
export class ContainerFactory<S> {

  public constructor(private serviceFactories: Array<FeatureFactory<any>> = []) {
  }

  /**
   * Merge functional service factory.
   */
  public add<FS>(f1: FeatureFactory<FS, S>): ContainerFactory<S & FS> {
    return new ContainerFactory([...this.serviceFactories, f1] as any) as any;
  }

  public async build(): Promise<ServiceContainer<S>> {
    const container = createMutableLockableContainer();
    invokeFeatureFactories(container)(this.serviceFactories as any);
    return fromPairs(container.services()) as any;
  }

}
