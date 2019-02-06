import { FeatureDependencyCollection } from '../Value/FeatureDependencyCollection';
import { BuildableContainer } from '../Buildable/BuildableContainer';
import { FeatureConstructor } from '..';
import { BuildChain } from './BuildChain';

export interface BuildContext<Services, Registries> {
  features: FeatureDependencyCollection;
  container: BuildableContainer<Services, Registries>;
  featureClasses: Array<FeatureConstructor<any, Services, Registries>>;
  buildChain: BuildChain<Services, Registries>;
}

export interface BuildStep<Services, Registries> {

  build(context: BuildContext<Services, Registries>): Promise<void>;

}
