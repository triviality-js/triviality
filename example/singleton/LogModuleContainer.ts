import { ContainerFactory } from '../../src';
import { LogModule } from './LogModule';

ContainerFactory
  .create()
  .add(LogModule)
  .build()
  .then((container) => {
    const johnLogger = container.prefixedLoggerService('John:');
    johnLogger.info('Hallo Jane!');
    const janeLogger = container.prefixedLoggerService('Jane:');
    janeLogger.info('Hi John!');

  });
