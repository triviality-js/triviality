import { FeatureFactory } from './FeatureFactory';
import { invokeFeatureFactories } from './invokeFeatureFactory';
import { createMutableLockableContainer } from './Container';
import { SetupFeature, SetupFeatureServices } from './Features/SetupFeature';
import { InferServicesTypes } from './ServiceFactory';
import { mapObjIndexed } from 'ramda';

/**
 * Container factory.
 */
export class ContainerFactory<S> {
  public static create = (): ContainerFactory<SetupFeatureServices> => {
    const container = new ContainerFactory<SetupFeatureServices>();
    return container.add(SetupFeature);
  };

  public constructor(private serviceFactories: Array<FeatureFactory<any>> = []) {
  }

  /**
   * Merge functional service factory.
   */
  public add<FS>(f1: FeatureFactory<FS, S>): ContainerFactory<S & FS> {
    return new ContainerFactory([...this.serviceFactories, f1] as any) as any;
  }

  public async build(): Promise<InferServicesTypes<S>> {
    const container = createMutableLockableContainer();
    invokeFeatureFactories(container)(this.serviceFactories as any);
    const services: any = container.lock();
    await services.callSetupServices()();
    return mapObjIndexed((sf: any) => sf(), services) as any;
  }

}
