import { testFeatureFactory } from '@triviality/core';
import { JSONSerializerFeature } from '../JSONSerializerFeature';
import { JSONSerializer } from '../JSONSerializer';

it('Exposes serializer', async () => {
  const { serializer } = await testFeatureFactory(JSONSerializerFeature, {});
  expect(serializer).toBeInstanceOf(JSONSerializer);
});
