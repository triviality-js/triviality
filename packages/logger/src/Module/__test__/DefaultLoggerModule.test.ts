import { DefaultLoggerModule } from '../DefaultLoggerModule';
import { PrefixDateLogger } from '../../PrefixDateLogger';

it('Can create DefaultLoggerModule', () => {

  const module = new DefaultLoggerModule();
  module.logger().info('test');
  expect(module.logger()).toBeInstanceOf(PrefixDateLogger);
});
