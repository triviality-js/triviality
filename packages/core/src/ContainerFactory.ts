import { FeatureFactory } from './FeatureFactory';
import { ServiceContainer } from './ServiceContainer';

/**
 * Container factory.
 */
export class ContainerFactory<S> {

  public constructor(private serviceFactories: Array<FeatureFactory<S>> = []) {
  }

  /**
   * Merge functional service factory.
   */
  public add<FS>(f1: FeatureFactory<FS, S>): ContainerFactory<S & FS> {
    return new ContainerFactory([...this.serviceFactories, f1] as any) as any;
  }

  public async build(): Promise<ServiceContainer<S>> {

  }
}
