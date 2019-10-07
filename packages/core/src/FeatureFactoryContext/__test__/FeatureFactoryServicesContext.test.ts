import { SF } from '../../ServiceFactory';
import { FeatureFactoryServicesContext, servicesByTags } from '../FeatureFactoryServicesContext';

type FetchA = (tag: 'foo') => SF<number>;
type FetchB = (tag: 'bar') => SF<string>;

it('Can fetch services', () => {
  const fetchService: FetchA & FetchB = jest.fn((tag: 'foo' | 'bar'): any => {
    return () => tag === 'foo' ? 1 : 'test';
  });
  const [foo, bar] = servicesByTags<'foo', SF<number>, 'bar', SF<string>>(
    fetchService,
    'foo',
    'bar',
  );
  expect(fetchService).not.toBeCalled();
  expect(foo()).toEqual(1);
  expect(bar()).toEqual('test');
});

it('Can fetch services FeatureFactoryServicesContext', () => {
  const fetchService: FetchA & FetchB = jest.fn((tag: 'foo' | 'bar'): any => {
    return () => tag === 'foo' ? 1 : 'test';
  });
  const withServices = servicesByTags<'foo', SF<number>, 'bar', SF<string>>(fetchService);
  const context: FeatureFactoryServicesContext<{ foo: SF<number>, bar: SF<string> }> = {
    services: withServices as any,
  };
  const [foo, bar] = context.services('foo', 'bar');
  expect(fetchService).not.toBeCalled();
  expect(foo()).toEqual(1);
  expect(bar()).toEqual('test');
});
