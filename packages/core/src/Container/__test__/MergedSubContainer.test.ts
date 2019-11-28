import { createMergedSubContainer } from '../MergedSubContainer';
import { createMutableContainer } from '../MutableContainer';

it('Can create a container', () => {
  const container = createMergedSubContainer(createMutableContainer());
  expect(container).toBeDefined();
});

it('Can set a sf', () => {
  const container = createMergedSubContainer(createMutableContainer());
  const sf = jest.fn();
  container.setService('serviceName', sf);
  expect(container.hasService('serviceName')).toBeTruthy();
  expect(container.getService('serviceName')).toBeInstanceOf(Function);
});

it('service should be singleton', () => {
  const container = createMergedSubContainer(createMutableContainer());
  const service = { foo: 'bar' };
  const sf = jest.fn().mockReturnValue(service);
  container.setService('serviceName', sf);
  container.lock();
  expect(container.getService('serviceName')()).toBe(service);
  expect(container.getService('serviceName')()).toBe(service);
  expect(sf).toBeCalledTimes(1);
});

it('Can override a sub service', () => {
  const container = createMergedSubContainer(createMutableContainer());
  const service = { foo: 'bar' };
  const sf = jest.fn().mockReturnValue(service);
  container.setService('serviceName', sf);
  const service2 = { hallo: () => 1 };
  const sf2 = jest.fn().mockReturnValue(service2);
  container.setService('serviceName', sf2);
  container.lock();
  expect(container.getService('serviceName')()).toBe(service2);
  expect(container.getService('serviceName')()).toBe(service2);
  expect(sf).toBeCalledTimes(0);
  expect(sf2).toBeCalledTimes(1);
});

it('Can override a main service', () => {
  const main = createMutableContainer();
  const service = { foo: 'bar' };
  const sf = jest.fn().mockReturnValue(service);
  main.setService('serviceName', sf);
  const container = createMergedSubContainer(main);
  const service2 = { hallo: () => 1 };
  const sf2 = jest.fn().mockReturnValue(service2);
  container.setService('serviceName', sf2);
  container.lock();
  expect(container.getService('serviceName')()).toBe(service2);
  expect(container.getService('serviceName')()).toBe(service2);
  expect(sf).toBeCalledTimes(0);
  expect(sf2).toBeCalledTimes(1);
});

it('Can get all current services', () => {
  const main = createMutableContainer();
  main.setService('hallo', () => 'world');
  const container = createMergedSubContainer(main);
  container.setService('foo', () => 'bar');
  container.setService('John', () => 'Doe');
  const services: any = container.currentServices();
  container.setService('foo', () => 'Hallo');
  container.lock();
  expect(services.length).toEqual(3);
  expect(services[0][0]).toEqual('hallo');
  expect(services[0][1]()).toEqual('world');
  expect(services[1][0]).toEqual('foo');
  expect(services[1][1]()).toEqual('bar');
  expect(services[2][0]).toEqual('John');
  expect(services[2][1]()).toEqual('Doe');
});

it('Service should exists', () => {
  const container = createMergedSubContainer(createMutableContainer());
  container.lock();
  expect(() => container.getCurrentService('foobar')).toThrowError();
});

it('Service functions should not have arguments', () => {
  const container = createMergedSubContainer(createMutableContainer());
  expect(() => container.setService('bar', ((foo: string) => foo) as any)).toThrowError();
});

it('Service can be defined again on main container', () => {
  const main = createMutableContainer();
  const container = createMergedSubContainer(main);
  const sf = jest.fn(() => 1);
  container.setService('myService', sf);
  main.setService('myService', container.getService('myService'));
  container.lock();
  expect(main.getService('myService')()).toEqual(1);
});
