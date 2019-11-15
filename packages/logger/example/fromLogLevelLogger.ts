import { ConsoleLogger, FromLogLevelLogger, LogLevel } from '../src';

const logger = new ConsoleLogger(console);
const witPrefix = new FromLogLevelLogger(logger, LogLevel.info);
witPrefix.trace('This will be ignored');
witPrefix.info('Hallo!');
