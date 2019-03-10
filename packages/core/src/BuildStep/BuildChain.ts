import { RegisterFeatureServices } from './RegisterFeatureServices';
import { OverrideServices } from './OverrideServices';
import { MergeRegistries } from './MergeRegistries';
import { SetupFeatures } from './SetupFeatures';

export class BuildChain<Services, Registries> {

  protected defineLockedServices = new RegisterFeatureServices<Services, Registries>();
  protected overrideServices = new OverrideServices<Services, Registries>();
  protected mergeRegistries = new MergeRegistries<Services, Registries>();
  protected setupFeatures = new SetupFeatures<Services, Registries>();

  public getStepsInOrder() {
    return [
      this.defineLockedServices,
      this.overrideServices,
      this.mergeRegistries,
      this.setupFeatures,
    ];
  }

}
