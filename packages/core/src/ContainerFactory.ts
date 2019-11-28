import { FeatureFactory } from './FeatureFactory';
import { invokeFeatureFactories } from './invokeFeatureFactory';
import { createMutableLockableContainer } from './Container';
import { SetupFeature, SetupFeatureServices } from './Feature';
import { mapObjIndexed } from 'ramda';

/**
 * Container factory.
 */
export class ContainerFactory<S> {
  public static create = (): ContainerFactory<SetupFeatureServices> => {
    const container = new ContainerFactory<SetupFeatureServices>();
    return container.add(SetupFeature);
  };

  public constructor(private featureFactories: FeatureFactory[] = []) {
  }

  /**
   * Merge functional service factory.
   */
  public add<Services>(f1: FeatureFactory<Services, S>): ContainerFactory<S & Services> {
    return new ContainerFactory([...this.featureFactories, f1] as any) as any;
  }

  public async build(): Promise<S> {
    const container = createMutableLockableContainer();
    invokeFeatureFactories(container)(this.featureFactories as any);
    const services: any = container.lock();
    await services.callSetupServices()();
    return mapObjIndexed((sf: any) => sf(), services) as any;
  }
}
