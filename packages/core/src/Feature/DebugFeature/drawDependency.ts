import { drawTree } from './asciitree';
import { ServiceFactoryReference } from '../../Value/ServiceFactoryReference';
import { InternalServiceFactoryReference } from '../../Value/InternalServiceFactoryReference';
import { ImmutableServiceReferenceList } from '../../Value/ImmutableServiceReferenceList';

export function filterUnreferencedInternalDependencies(dependencies: ImmutableServiceReferenceList): ImmutableServiceReferenceList {
  return dependencies.filter((dependency => {
    if (dependency instanceof InternalServiceFactoryReference) {
      return !dependency.getDependencies().isEmpty();
    }
    return true;
  }));
}

export function filterInternalDependencies(dependencies: ImmutableServiceReferenceList): ImmutableServiceReferenceList {
  return dependencies.filter((dependency => {
    if (dependency instanceof InternalServiceFactoryReference) {
      return true;
    }
    return true;
  }));
}

export function drawDependency(root: ServiceFactoryReference) {
  return drawTree<ServiceFactoryReference>(
    root,
    (dependency) => {
      return dependency.label();
    },
    (dependency) => filterUnreferencedInternalDependencies(dependency.getDependencies()).toArray(),
  );
}

export function drawDependencies(dependencies: ImmutableServiceReferenceList) {
  return drawDependency({
    getDependencies(): ImmutableServiceReferenceList {
      return filterInternalDependencies(dependencies);
    },
    label: () => '',
  } as any);
}
