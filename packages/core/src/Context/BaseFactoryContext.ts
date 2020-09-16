import { ServiceContainerError } from '../Error/ServiceContainerError';
import { FeatureFactory } from '../FeatureFactory';
import { ServicesAsFactories } from '../ServiceFactory';

export interface BaseFactoryContext<TServices, TDependencies> {
  instances(): TDependencies & TServices;

  dependencies(): ServicesAsFactories<TDependencies>;

  feature: FeatureFactory<TServices, TDependencies>;
}

export const createBaseFactoryContext = <TServices, TDependencies>(ff: FeatureFactory<TServices, TDependencies>) => {
  let instances: null | (TServices & TDependencies) = null;
  let dependencies: null | (ServicesAsFactories<TDependencies>) = null;
  let context: BaseFactoryContext<TServices, TDependencies> = {
    feature: ff,
    instances(): TServices & TDependencies {
      if (instances === null) {
        throw new ServiceContainerError('Missing services. Can only call service factories after container is fully build.');
      }
      return instances;
    },
    dependencies(): ServicesAsFactories<TDependencies> {
      if (dependencies === null) {
        throw new ServiceContainerError('Missing dependencies. Can only call service factories after container is fully build.');
      }
      return dependencies;
    },
  };
  return {
    context,
    setInstances: (deps: TServices & TDependencies) => {
      instances = deps;
    },
    setDependencies: (deps: ServicesAsFactories<TDependencies>) => {
      dependencies = deps;
    },
  };
};
