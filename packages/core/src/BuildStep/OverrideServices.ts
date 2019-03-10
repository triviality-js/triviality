import { BuildContext, BuildStep } from './BuildStep';
import { getAllPropertyValues } from '../util/getAllPropertyNames';
import { ContainerError } from '../Error/ContainerError';

export class OverrideServices<Services, Registries> implements BuildStep<Services, Registries> {

  public async build(context: BuildContext<Services, Registries>): Promise<void> {
    const { container, features } = context;
    for (const feature of features.withServiceOverridesFunctions().toArray()) {
      const overrideableContainer = container.getOverrideableReferenceContainer();

      const returnValue = await feature.getServiceOverrideFunction()(overrideableContainer.getReference());
      if (overrideableContainer.getReference() === returnValue || overrideableContainer.getReference() === returnValue) {
        throw ContainerError.shouldReturnNewObjectWithServices();
      }
      const overrides = getAllPropertyValues(returnValue);
      if (overrides.length === 0) {
        overrideableContainer.freezeContainer();
        continue;
      }
      for (const [name, service] of overrides) {
        overrideableContainer.overrideService(name, service);
      }
      overrideableContainer.freezeContainer();
    }
    container.freezeContainer();
  }

}
