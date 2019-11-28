import { ConsoleFeature } from '../ConsoleFeature';
import { HalloConsoleFeature } from '../Command/HalloConsoleFeature';
import { ByeConsoleFeature } from '../Command/ByeConsoleFeature';
import triviality from '../../../src';

it('should run', async () => {
  await triviality()
    .add(ConsoleFeature)
    .add(HalloConsoleFeature)
    .add(ByeConsoleFeature)
    .build()
    .then((container) => {
      return container.consoleService.handle();
    });

});
