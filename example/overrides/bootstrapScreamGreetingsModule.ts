import { ContainerFactory } from '../../src';
import { GreetingsModule } from './GreetingsModule';
import { LogModule } from '../module/LogModule';
import { ScreamGreetingsModule } from './ScreamGreetingsModule';

ContainerFactory
  .create()
  .add(LogModule)
  .add(GreetingsModule)
  .add(ScreamGreetingsModule)
  .build()
  .then((container) => {
    const logger = container.logger();
    const halloService = container.greetingService();
    logger.info(halloService.greet('Triviality'));
  });
