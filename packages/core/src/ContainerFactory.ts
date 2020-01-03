import { FeatureFactory } from './FeatureFactory';
import { invokeFeatureFactories, invokeFeatureFactory } from './invokeFeatureFactory';
import { callSetupServices, SetupFeature, SetupFeatureServices } from './Feature';
import { ServiceFunctionReferenceContainer } from './Container';
import { KernelFeature, KernelServices } from './Feature/KernelFeature';

/**
 * Container factory.
 */
export class ContainerFactory<S> {
  public static create = (): ContainerFactory<SetupFeatureServices & KernelServices> => {
    const container = new ContainerFactory<SetupFeatureServices & KernelServices>();
    return container
      .add(SetupFeature);
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
    const container = new ServiceFunctionReferenceContainer();
    const kernelFeature: any = KernelFeature(container);
    const features: FeatureFactory[] = [kernelFeature, ...this.featureFactories];
    invokeFeatureFactories({ container, invoke: invokeFeatureFactory })(features);
    const services: S & SetupFeatureServices & KernelServices = container.build();
    await callSetupServices(services.setupCallbacks);
    return services;
  }
}
