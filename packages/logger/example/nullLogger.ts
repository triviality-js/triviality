import { NullLogger } from '../src/NullLogger';

const logger = new NullLogger();
logger.info('Hallo', 'Void');
