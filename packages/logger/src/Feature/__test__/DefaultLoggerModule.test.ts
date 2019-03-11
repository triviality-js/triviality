import { DefaultLoggerFeature } from '../DefaultLoggerFeature';
import { PrefixDateLogger } from '../../PrefixDateLogger';

it('Can create DefaultLoggerModule', () => {

  const module = new DefaultLoggerFeature();
  module.logger().info('test');
  expect(module.logger()).toBeInstanceOf(PrefixDateLogger);
});
