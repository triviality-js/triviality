import { serviceOfServiceFactories, SF } from '../../ServiceFactory';
import { makeImmutableRegistrySet, RegistrySet } from './ImmutableRegistrySet';
import { wrapReturnAsReference } from '../ReferenceContext';
import { getServices, RegisterListArguments } from './RegistryListContext';
import { ServiceFunctionReferenceContainerInterface } from '../../Container/ServiceFunctionReferenceContainerInterface';

export interface RegistrySetContext<T> {
  registerSet<TType>(...items: RegisterListArguments<T, TType>): SF<RegistrySet<TType>>;
}

export const createFeatureFactoryRegistrySetContext = <T>(container: ServiceFunctionReferenceContainerInterface): RegistrySetContext<T> => ({
  registerSet: wrapReturnAsReference(registerSet<T, any>(container)),
});

export function registerSet<Services, T>({ getService }: ServiceFunctionReferenceContainerInterface): (...items: RegisterListArguments<Services, T>) => SF<RegistrySet<T>> {
  return (...items: RegisterListArguments<Services, T>) => {
    const serviceReferences = getServices<Services, T>(getService as any)(...items);
    return () => makeImmutableRegistrySet<T>(...serviceOfServiceFactories(serviceReferences));
  };
}
