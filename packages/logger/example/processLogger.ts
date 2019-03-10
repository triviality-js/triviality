import { ProcessLogger } from '../src/ProcessLogger';

const logger = new ProcessLogger(process);
logger.info('Hallo', 'World');
