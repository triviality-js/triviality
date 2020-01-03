import { DefaultLoggerFeature } from '../DefaultLoggerFeature';
import { PrefixDateLogger } from '../../PrefixDateLogger';
import { testFeatureFactory } from '@triviality/core';

it('Can create DefaultLoggerModule', async () => {
  const feature = await testFeatureFactory(DefaultLoggerFeature, {});
  feature.logger.info('test');
  expect(feature.logger).toBeInstanceOf(PrefixDateLogger);
});
