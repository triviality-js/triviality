import { ConsoleLogger } from '../src/ConsoleLogger';

const logger = new ConsoleLogger(console);
logger.info('Hallo', 'World');
logger.info('Bye %s', 'World');
