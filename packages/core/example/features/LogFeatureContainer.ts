import { triviality } from '../../src';
import { LogFeature } from './LogFeature';

triviality()
  .add(LogFeature)
  .build()
  .then(({ logger }) => {
    logger.info('Hallo word');
  });
