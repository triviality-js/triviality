import { triviality } from '../../src';
import { LogModule } from './LogModule';

triviality()
  .add(LogModule)
  .build()
  .then((container) => {
    const logger = container.logger();
    logger.info('Hallo word');
  });
