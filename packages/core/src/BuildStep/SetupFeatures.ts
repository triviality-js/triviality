import { BuildContext, BuildStep } from './BuildStep';

export class SetupFeatures<Services, Registries> implements BuildStep<Services, Registries> {

  public async build(context: BuildContext<Services, Registries>): Promise<void> {
    const { features } = context;
    for (const feature of features.withSetupsFunctions().toArray()) {
      await feature.getSetupFunction()();
    }
  }

}
