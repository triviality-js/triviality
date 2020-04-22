import { SF } from '../../ServiceFactory';
import {
  createFeatureFactoryServicesContext,
  instancesByTags,
  servicesByTags,
  ServicesContext,
} from '../ServicesContext';
import { ServiceFunctionReferenceContainer } from '../../Containerd';
import { TaggedServiceFactoryReference } from '../../Value/TaggedServiceFactoryReference';
import { always } from 'ramda';

type FetchA = (tag: 'foo') => SF<number>;
type FetchB = (tag: 'bar') => SF<string>;

it('Can fetch services', () => {
  const fetchService: FetchA & FetchB = jest.fn((tag: 'foo' | 'bar'): any => {
    return () => tag === 'foo' ? 1 : 'test';
  });
  const withServices = servicesByTags<'foo', SF<number>, 'bar', SF<string>>(fetchService);
  const context: ServicesContext<{ foo: SF<number>, bar: SF<string> }> = {
    dependencies: null as any,
    service: null as any,
    services: withServices as any,
    instances: null as any,
    instance: null as any,
  };
  const [foo, bar] = context.services('foo', 'bar');
  expect(fetchService).not.toBeCalled();
  expect(foo()).toEqual(1);
  expect(bar()).toEqual('test');
});

it('Can fetch service instances', () => {
  const fetchServices = jest.fn((_tags: string[]): any => {
    return [() => 1, () => 2];
  });
  const withServices = instancesByTags(fetchServices as any);
  const context: ServicesContext<{ foo: SF<number>, bar: SF<string> }> = {
    dependencies: null as any,
    service: null as any,
    services: null as any,
    instances: withServices as any,
    instance: null as any,
  };
  const [foo, bar] = context.instances('foo', 'bar');
  expect(fetchServices).toBeCalledWith('foo', 'bar');
  expect(foo).toEqual(1);
  expect(bar).toEqual(2);
});

it('Can fetch single service instance', async () => {
  const container = new ServiceFunctionReferenceContainer();
  container.add(new TaggedServiceFactoryReference({
    tag: 'foo',
    factory: always('bar'),
    feature: () => Object,
  }));
  const context = createFeatureFactoryServicesContext(container);
  await container.build();
  expect(context.instance('foo')).toEqual('bar');
});
