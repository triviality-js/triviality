import { triviality } from '../../src';
import { LogFeature } from './LogFeature';

triviality()
  .add(LogFeature)
  .build()
  .then((container) => {
    const logger = container.logger();
    logger.info('Hallo word');
  });
