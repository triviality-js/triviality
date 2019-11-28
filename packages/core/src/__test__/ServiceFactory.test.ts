import { AllAsServiceFactory, assertServiceTag } from '../ServiceFactory';

it('Can wrap services as sf', () => {
  const [one, two] = AllAsServiceFactory([1, 2]);
  expect(one()).toEqual(1);
  expect(two()).toEqual(2);
});

it('Can wrap services as sf', () => {
  expect(() => assertServiceTag(1)).toThrowError();
});
