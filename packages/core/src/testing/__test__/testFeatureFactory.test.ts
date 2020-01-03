import { FF } from '../../FeatureFactory';
import { testFeatureFactory } from '../index';

it('Execute feature directory', async () => {

  const myFeature: FF<{
    three: number,
  }, {
    one: number,
  }> = ({ one }) => {
    return {
      three: () => one() + 2,
    };
  };

  const result = await testFeatureFactory(myFeature, {
    one: 1,
  });

  expect(result.three).toEqual(3);
});
