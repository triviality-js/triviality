import { CollectionLogger, ConsoleLogger, PrefixLogger } from '../src';

const consoleLogger = new ConsoleLogger(console);
const logger = new CollectionLogger([
  new PrefixLogger(consoleLogger, 'Hallo '),
  new PrefixLogger(consoleLogger, 'Bye '),
]);
logger.info('World');
