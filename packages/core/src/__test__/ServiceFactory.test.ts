import { AllAsServiceFactory, assertServiceTag, assetServiceFactory } from '../ServiceFactory';

it('Can wrap services as sf', () => {
  const [one, two] = AllAsServiceFactory([1, 2]);
  expect(one()).toEqual(1);
  expect(two()).toEqual(2);
});

it('assetServiceFactory should be a function without arguments', () => {
  expect(() => assetServiceFactory(1)).toThrowError();
  expect(() => assetServiceFactory((foo: number) => foo)).toThrowError();
  expect(assetServiceFactory(() => 1)).toEqual(true);
});

it('Can wrap services as sf', () => {
  expect(() => assertServiceTag(1)).toThrowError();
  expect(() => assertServiceTag('')).toThrowError();
  expect(assertServiceTag('my tag')).toEqual(true);
});
