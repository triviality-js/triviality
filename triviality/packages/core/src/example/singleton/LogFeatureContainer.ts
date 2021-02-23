import { triviality } from '@triviality/core';
import { LogFeature } from './LogFeature';

triviality()
  .add(LogFeature)
  .build()
  .then((container) => {
    const johnLogger = container.prefixedLogger('John:');
    johnLogger.info('Hallo Jane!');
    const janeLogger = container.prefixedLogger('Jane:');
    janeLogger.info('Hi John!');

  });
