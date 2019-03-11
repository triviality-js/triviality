import { ConsoleLogger } from '../src/ConsoleLogger';
import { PrefixLogger } from '../src/PrefixLogger';

const logger = new ConsoleLogger(console);
const withPrefix = new PrefixLogger(logger, 'Hallo: ');
withPrefix.info('World');
