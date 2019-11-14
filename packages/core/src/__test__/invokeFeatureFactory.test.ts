import { createImmutableContainer, createMutableContainer } from '../Container';
import { FF } from '../FeatureFactory';
import { invokeFeatureFactories, invokeFeatureFactory } from '../invokeFeatureFactory';
import { SF } from '../ServiceFactory';

describe('invokeFeatureFactory', () => {

  it('Can invoke feature factory', () => {
    const container = createMutableContainer();
    const service = jest.fn().mockReturnValue(1);
    invokeFeatureFactory(container, () => ({
      service4: service,
    }));

    expect(container.hasService('service4')).toBeTruthy();
    expect(container.getService('service4')()).toBe(1);
  });

  it('Called with all dependencies', () => {
    const container = createMutableContainer().setService('service', () => 1);
    const mockSF = jest.fn().mockReturnValue({});
    invokeFeatureFactory(container, mockSF);
    expect(container.hasService('service')).toBeTruthy();
    expect(container.getService('service')()).toBe(1);
  });

  it('Can\'t have conflicts with context names', () => {
    expect(() => invokeFeatureFactory(createMutableContainer(createImmutableContainer()), () => ({
      reference: jest.fn(),
    }))).toThrowError();
    expect(() => invokeFeatureFactory(createMutableContainer(), () => ({
      override: jest.fn(),
    }))).toThrowError();
    expect(() => invokeFeatureFactory(createMutableContainer(), () => ({
      registers: jest.fn(),
    }))).toThrowError();
    expect(() => invokeFeatureFactory(createMutableContainer(), () => ({
      services: jest.fn(),
    }))).toThrowError();
    expect(() => invokeFeatureFactory(createMutableContainer(), () => ({
      service: jest.fn(),
    }))).toThrowError();
  });

  it('Can\'t define same service name', () => {
    const container = createMutableContainer();
    container.setService('foobar', () => 1);
    expect(() =>   invokeFeatureFactory(container, () => ({
      foobar: jest.fn(),
    }))).toThrowError();
  });
});

it('invokeFeatureFactories', () => {
  const container = createMutableContainer();
  const service1 = jest.fn().mockReturnValue(1);

  const ff2: FF<{ service2: SF<number> }, { service1: SF<number> }> = ({ service1: service2 }) => ({
    service2,
  });

  invokeFeatureFactories(container)([
    () => ({
      service1,
    }),
    ff2,
  ]);

  expect(container.hasService('service1')).toBeTruthy();
  expect(container.hasService('service2')).toBeTruthy();
  expect(container.getService('service1')()).toBe(1);
  expect(container.getService('service2')()).toBe(1);
});
