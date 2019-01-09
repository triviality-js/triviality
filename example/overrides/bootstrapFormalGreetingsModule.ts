import { triviality } from '../../src';
import { GreetingsModule } from './GreetingsModule';
import { LogModule } from '../module/LogModule';
import { FormalGreetingsModule } from './FormalGreetingsModule';

triviality()
  .add(LogModule)
  .add(GreetingsModule)
  .add(FormalGreetingsModule)
  .build()
  .then((container) => {
    const logger = container.logger();
    const halloService = container.greetingService();
    logger.info(halloService.greet('Triviality'));
  });
