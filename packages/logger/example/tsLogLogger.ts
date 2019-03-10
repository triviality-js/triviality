import { TsLogLogger } from '../src/TsLogLogger';
import { Logger } from 'ts-log';

const tsLogger: Logger = console;
const logger = new TsLogLogger(tsLogger);
logger.info('Hallo', 'World');
