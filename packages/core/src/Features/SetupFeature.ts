import { RegistryList } from '../Context';
import { FF } from '../FeatureFactory';

export type SetupCallback = () => Promise<void> | void;

export interface SetupFeatureServices {
  setup: RegistryList<SetupCallback>;
  callSetupServices: SetupCallback;
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
