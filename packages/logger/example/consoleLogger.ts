import { ConsoleLogger } from '../src';

const logger = new ConsoleLogger(console);
logger.info('Hallo', 'World');
logger.info('Bye %s', 'World');
