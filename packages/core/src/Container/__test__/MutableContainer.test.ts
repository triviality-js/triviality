import { createMutableContainer } from '../MutableContainer';

it('Can create a container', () => {
  const container = createMutableContainer();
  expect(container).toBeDefined();
});

it('Can set a sf', () => {
  const container = createMutableContainer();
  const sf = jest.fn();
  container.setService('serviceName', sf);
  expect(container.hasService('serviceName')).toBeTruthy();
  expect(container.getService('serviceName')).toBeInstanceOf(Function);
});

it('service should be singleton', () => {
  const container = createMutableContainer();
  const service = { foo: 'bar' };
  const sf = jest.fn().mockReturnValue(service);
  container.setService('serviceName', sf);
  expect(container.getService('serviceName')()).toBe(service);
  expect(container.getService('serviceName')()).toBe(service);
  expect(sf).toBeCalledTimes(1);
});

it('Can override a service', () => {
  const container = createMutableContainer();
  const service = { foo: 'bar' };
  const sf = jest.fn().mockReturnValue(service);
  container.setService('serviceName', sf);
  const service2 = { hallo: () => 1 };
  const sf2 = jest.fn().mockReturnValue(service2);
  container.setService('serviceName', sf2);
  expect(container.getService('serviceName')()).toBe(service2);
  expect(container.getService('serviceName')()).toBe(service2);
  expect(sf).toBeCalledTimes(0);
  expect(sf2).toBeCalledTimes(1);
});

it('Can get all current services', () => {
  const container = createMutableContainer();
  container.setService('foo', () => 'bar');
  container.setService('John', () => 'Doe');
  const services: any = container.currentServices();
  container.setService('foo', () => 'Hallo');
  expect(services.length).toEqual(2);
  expect(services[0][0]).toEqual('foo');
  expect(services[0][1]()).toEqual('bar');
  expect(services[1][0]).toEqual('John');
  expect(services[1][1]()).toEqual('Doe');
});

it('Service should exists', () => {
  const container = createMutableContainer();
  expect(() => container.getCurrentService('foobar')).toThrowError();
});

it('Service functions should not have arguments', () => {
  const container = createMutableContainer();
  expect(() => container.setService('bar', ((foo: string) => foo) as any)).toThrowError();
});
