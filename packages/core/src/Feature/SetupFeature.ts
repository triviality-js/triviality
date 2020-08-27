import { FF } from '../FeatureFactory';

export type SetupCallback = () => Promise<void> | void;

export interface SetupFeatureServices {
  setupCallbacks: SetupCallback[];
}

export const callSetupServices = async (setups: Iterable<SetupCallback>) => {
  for (const setup of setups) {
    await setup();
  }
};

export const SetupFeature: FF<SetupFeatureServices> = function setupFeature() {
  return {
    setupCallbacks: () => [],
  };
};
