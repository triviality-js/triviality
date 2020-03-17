import { ServiceFunctionReferenceContainer } from '../Container';
import { FF } from '../FeatureFactory';
import { invokeFeatureFactories, invokeFeatureFactory } from '../invokeFeatureFactory';
import { SF } from '../ServiceFactory';
import { TaggedServiceFactoryReference } from '../Value/TaggedServiceFactoryReference';

describe('invokeFeatureFactory', () => {

  it('Can invoke feature factory', async () => {
    const container = new ServiceFunctionReferenceContainer();
    const service = jest.fn().mockReturnValue(1);
    invokeFeatureFactory({ container }, () => ({
      service4: service,
    }));

    expect(container.references().hasTagged('service4')).toBeTruthy();
    await container.build();
    expect(container.getService('service4')()).toBe(1);
  });

  it('Called with all dependencies', async () => {
    const container = new ServiceFunctionReferenceContainer();

    invokeFeatureFactory({ container }, () => ({
      tag1: () => 1,
    }));

    const mockSF = jest.fn().mockReturnValue({});
    invokeFeatureFactory({ container }, mockSF);
    await container.build();
    expect(container.references().hasTagged('tag1')).toBeTruthy();
    expect(container.getService('tag1')()).toBe(1);
  });

  it('Can\'t have conflicts with context names', () => {
    expect(() => invokeFeatureFactory({ container: new ServiceFunctionReferenceContainer() }, () => ({
      reference: jest.fn(),
    }))).toThrowError();
    expect(() => invokeFeatureFactory({ container: new ServiceFunctionReferenceContainer() }, () => ({
      override: jest.fn(),
    }))).toThrowError();
    expect(() => invokeFeatureFactory({ container: new ServiceFunctionReferenceContainer() }, () => ({
      registers: jest.fn(),
    }))).toThrowError();
    expect(() => invokeFeatureFactory({ container: new ServiceFunctionReferenceContainer() }, () => ({
      services: jest.fn(),
    }))).toThrowError();
    expect(() => invokeFeatureFactory({ container: new ServiceFunctionReferenceContainer() }, () => ({
      service: jest.fn(),
    }))).toThrowError();
  });

  it('Can\'t define same service name', () => {
    const container = new ServiceFunctionReferenceContainer();
    container.add(new TaggedServiceFactoryReference({
      factory: () => 1,
      tag: 'foobar',
      feature: () => 1,
    }));
    expect(() => invokeFeatureFactory({ container }, () => ({
      foobar: jest.fn(),
    }))).toThrowError();
  });
});

it('invokeFeatureFactories', async () => {
  const container = new ServiceFunctionReferenceContainer();
  const service1 = jest.fn().mockReturnValue(1);

  const ff2: FF<{ service2: SF<number> }, { service1: SF<number> }> = ({ service1: service2 }) => ({
    service2,
  });

  invokeFeatureFactories({ container })([
    () => ({
      service1,
    }),
    ff2,
  ]);

  expect(container.references().hasTagged('service1')).toBeTruthy();
  expect(container.references().hasTagged('service2')).toBeTruthy();
  await container.build();
  expect(container.getService('service1')()).toBe(1);
  expect(container.getService('service2')()).toBe(1);
});
