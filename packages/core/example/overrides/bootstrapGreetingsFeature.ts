import { triviality } from '../../src';
import { GreetingsFeature } from './GreetingsFeature';
import { LogFeature } from '../features/LogFeature';

triviality()
  .add(LogFeature)
  .add(GreetingsFeature)
  .build()
  .then((container) => {
    const logger = container.logger();
    const halloService = container.greetingService();
    logger.info(halloService.greet('Triviality'));
  });
