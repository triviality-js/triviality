import { ConsoleLogger } from '../src/ConsoleLogger';
import { FromLogLevelLogger } from '../src/FromLogLevelLogger';
import { LogLevel } from '../src/LoggerInterface';

const logger = new ConsoleLogger(console);
const witPrefix = new FromLogLevelLogger(logger, LogLevel.info);
witPrefix.trace('This will be ignored');
witPrefix.info('Hallo!');
