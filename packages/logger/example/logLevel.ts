import { ConsoleLogger, LogLevel } from '../src';

const logger = new ConsoleLogger(console);
logger.log(LogLevel.info, 'Hallo', 'World');
