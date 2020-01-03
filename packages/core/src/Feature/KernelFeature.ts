import { ServiceFunctionReferenceContainer } from '../Container';
import { FF } from '../FeatureFactory';
import { ImmutableServiceReferenceList } from '../Value/ImmutableServiceReferenceList';

export interface KernelServices {
  dependencyInfo: {
    references(): ImmutableServiceReferenceList,
    callStack(): ImmutableServiceReferenceList,
  };
}

export const KernelFeature: (builder: ServiceFunctionReferenceContainer) => FF<KernelServices> = (container: ServiceFunctionReferenceContainer): FF<KernelServices> => function kernelFeature() {
  return {
    dependencyInfo: () => {
      return {
        references: () => container.references(),
        callStack: () => container.getCallStack(),
      };
    },
  };
};
