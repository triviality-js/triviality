import { RegistryList } from '../Context';
import { FF } from '../FeatureFactory';

export type SetupCallback = () => Promise<void> | void;

/**
 * TODO: rename to application hooks?
 */
export interface SetupFeatureServices {
  setupCallbacks: RegistryList<SetupCallback>;
}

export const callSetupServices = async (setups: Iterable<SetupCallback>) => {
  for (const setup of setups) {
    await setup();
  }
};

export const SetupFeature: FF<SetupFeatureServices> = function setupFeature({ registerList }) {
  return {
    setupCallbacks: registerList<SetupCallback>(),
  };
};
