import { triviality } from '../../src';
import { ConsoleFeature } from './ConsoleFeature';
import { HalloConsoleFeature } from './Command/HalloConsoleFeature';
import { ByeConsoleFeature } from './Command/ByeConsoleFeature';

triviality()
  .add(ConsoleFeature)
  .add(HalloConsoleFeature)
  .add(ByeConsoleFeature)
  .build()
  .then((container) => {
    return container.consoleService().handle();
  });
