import { DefaultLoggerFeature } from '../DefaultLoggerFeature';
import { PrefixDateLogger } from '../../PrefixDateLogger';
import triviality from "@triviality/core";

it('Can create DefaultLoggerModule', async () => {
  const {logger} = await triviality().add(DefaultLoggerFeature).build();
  logger.info('test');
  expect(logger).toBeInstanceOf(PrefixDateLogger);
});
