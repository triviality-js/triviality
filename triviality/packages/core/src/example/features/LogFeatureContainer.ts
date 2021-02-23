import { triviality } from '@triviality/core';
import { LogFeature } from './LogFeature';

triviality()
  .add(LogFeature)
  .build()
  .then(({ logger }) => {
    logger.info('Hallo word');
  });
