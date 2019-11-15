import { ConsoleLogger, PrefixLogger } from '../src';

const logger = new ConsoleLogger(console);
const withPrefix = new PrefixLogger(logger, 'Hallo: ');
withPrefix.info('World');
