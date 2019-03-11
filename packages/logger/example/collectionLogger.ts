import { CollectionLogger } from '../src/CollectionLogger';
import { ConsoleLogger } from '../src/ConsoleLogger';
import { PrefixLogger } from '../src/PrefixLogger';

const consoleLogger = new ConsoleLogger(console);
const logger = new CollectionLogger([
  new PrefixLogger(consoleLogger, 'Hallo '),
  new PrefixLogger(consoleLogger, 'Bye '),
]);
logger.info('World');
