import { ContainerFactory } from '../../src';
import { GreetingsModule } from './GreetingsModule';
import { LogModule } from '../module/LogModule';

ContainerFactory
  .create()
  .add(LogModule)
  .add(GreetingsModule)
  .build()
  .then((container) => {
    const logger = container.logger();
    const halloService = container.greetingService();
    logger.info(halloService.greet('Triviality'));
  });
