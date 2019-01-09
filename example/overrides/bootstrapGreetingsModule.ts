import { triviality } from '../../src';
import { GreetingsModule } from './GreetingsModule';
import { LogModule } from '../module/LogModule';

triviality()
  .add(LogModule)
  .add(GreetingsModule)
  .build()
  .then((container) => {
    const logger = container.logger();
    const halloService = container.greetingService();
    logger.info(halloService.greet('Triviality'));
  });
