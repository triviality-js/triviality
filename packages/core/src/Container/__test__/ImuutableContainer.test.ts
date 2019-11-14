import { createImmutableContainer } from '../ImmutableContainer';

it('Can create a container', () => {
  const container = createImmutableContainer();
  expect(container).toBeDefined();
});

it('Can set a sf', () => {
  const container = createImmutableContainer();
  const newContainer = container.setService('serviceName', () => 'foo');
  expect(container.hasService('serviceName')).toBeFalsy();
  expect(newContainer.hasService('serviceName')).toBeTruthy();
  expect(newContainer.getService('serviceName')).toBeInstanceOf(Function);
  expect(newContainer.getService('serviceName')()).toEqual('foo');
});

it('service should be singleton', () => {
  const container = createImmutableContainer();
  const service = { foo: 'bar' };
  const sf = jest.fn().mockReturnValue(service);
  const newContainer = container.setService('serviceName', sf);
  expect(newContainer.getService('serviceName')()).toBe(service);
  expect(newContainer.getService('serviceName')()).toBe(service);
  expect(sf).toBeCalledTimes(1);
});

it('Can override a service', () => {
  const container = createImmutableContainer();
  const service = { foo: 'bar' };
  const sf = jest.fn().mockReturnValue(service);
  container.setService('serviceName', sf);
  const service2 = { hallo: () => 1 };
  const sf2 = jest.fn().mockReturnValue(service2);
  const newContainer = container.setService('serviceName', sf2);
  expect(newContainer.getService('serviceName')()).toBe(service2);
  expect(newContainer.getService('serviceName')()).toBe(service2);
  expect(sf).toBeCalledTimes(0);
  expect(sf2).toBeCalledTimes(1);
});

it('Service should exists', () => {
  const container = createImmutableContainer();
  expect(() => container.getService('foobar')).toThrowError();
});

it('Service functions should not have arguments', () => {
  const container = createImmutableContainer();
  expect(() => container.setService('bar', ((foo: string) => foo) as any)).toThrowError();
});
