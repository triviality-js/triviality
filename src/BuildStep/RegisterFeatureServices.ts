import { BuildContext, BuildStep } from './BuildStep';
import { FeatureDependency } from '../Value/FeatureDependency';

export class RegisterFeatureServices<Services, Registries> implements BuildStep<Services, Registries> {

  public async build(context: BuildContext<Services, Registries>): Promise<void> {
    const { container, features, featureClasses } = context;
    for (const FeatureClass of featureClasses) {
      const instance = new FeatureClass(container.getReference());
      const feature = new FeatureDependency(instance);
      features.add(feature);
      for (const [name, service] of feature.getServices()) {
        container.defineLockedFeatureService(feature, name, service);
      }
    }
  }

}
