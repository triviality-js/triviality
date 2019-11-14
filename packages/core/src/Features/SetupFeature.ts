import { SF } from '../ServiceFactory';
import { RegistryList } from '../FeatureFactoryContext/FeatureFactoryRegistryContext';
import { FF } from '../FeatureFactory';

export type SetupCallback = () => Promise<void> | void;

export interface SetupFeatureServices {
  setup: SF<RegistryList<SetupCallback>>;
  callSetupServices: SF<SetupCallback>;
}

const callSetupServices = (setups: Iterable<SetupCallback>) =>
  async () => {
    for (const setup of setups) {
      await setup();
    }
  };

export const SetupFeature: FF<SetupFeatureServices> = ({ registerList, compose }) =>
  ({
    setup: registerList<SetupCallback>(),
    callSetupServices: compose(callSetupServices, 'setup'),
  });
