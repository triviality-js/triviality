import { triviality } from '@triviality/core';
import { ByeConsoleFeature } from './Command/ByeConsoleFeature';
import { HalloConsoleFeature } from './Command/HalloConsoleFeature';
import { ConsoleFeature } from './ConsoleFeature';

triviality()
  .add(ConsoleFeature)
  .add(HalloConsoleFeature)
  .add(ByeConsoleFeature)
  .build()
  .then((container) => container.consoleService.handle());
