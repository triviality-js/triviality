import { createImmutableContainer } from '../container';
import { FF } from '../FeatureFactory';
import { invokeFeatureFactories, invokeFeatureFactory } from '../invokeFeatureFactory';
import { SF } from '../ServiceFactory';

it('invokeFeatureFactory', () => {
  const container = createImmutableContainer();
  const service = jest.fn().mockReturnValue(1);
  const container2 = invokeFeatureFactory(container, () => ({
    service4: service,
  }));

  expect(container).not.toBe(container2);
  expect(container2.hasService('service4')).toBeTruthy();
  expect(container2.getService('service4')()).toBe(1);
});

it('invokeFeatureFactory, called with all dependencies', () => {
  const container = createImmutableContainer().setService('service', () => 1);
  const mockSF = jest.fn().mockReturnValue({});
  const container2 = invokeFeatureFactory(container, mockSF);

  expect(mockSF.mock.calls[0][0]).not.toBe(container2);
  expect(container2.hasService('service')).toBeTruthy();
  expect(container2.getService('service')()).toBe(1);
});

it('invokeFeatureFactories', () => {
  const container = createImmutableContainer();
  const service1 = jest.fn().mockReturnValue(1);

  const ff2: FF<{ service2: SF<number> }, { service1: SF<number> }> = ({ service1: service2 }) => ({
    service2,
  });

  const container2 = invokeFeatureFactories(container)([
    () => ({
      service1,
    }),
    ff2,
  ]);

  expect(container).not.toBe(container2);
  expect(container2.hasService('service1')).toBeTruthy();
  expect(container2.hasService('service2')).toBeTruthy();
  expect(container2.getService('service1')()).toBe(1);
  expect(container2.getService('service2')()).toBe(1);
});
