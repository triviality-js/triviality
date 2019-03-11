import { ConsoleLogger } from '../src/ConsoleLogger';
import { LogLevel } from '../src/LoggerInterface';

const logger = new ConsoleLogger(console);
logger.log(LogLevel.info, 'Hallo', 'World');
