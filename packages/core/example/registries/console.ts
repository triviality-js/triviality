import { triviality } from '../../src';
import { ByeConsoleFeature } from '../registries/Command/ByeConsoleFeature';
import { HalloConsoleFeature } from '../registries/Command/HalloConsoleFeature';
import { ConsoleFeature } from './ConsoleFeature';

triviality()
  .add(ConsoleFeature)
  .add(HalloConsoleFeature)
  .add(ByeConsoleFeature)
  .build()
  .then((container) => {
    return container.consoleService().handle();
  });
