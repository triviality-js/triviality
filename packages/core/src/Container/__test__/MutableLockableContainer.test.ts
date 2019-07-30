import { createMutableLockableContainer } from '../index';

it('Can create a container', () => {
  const container = createMutableLockableContainer();
  expect(container).toBeDefined();
});

it('Is unlocked by when created', () => {
  const container = createMutableLockableContainer();
  expect(container.isLocked()).toBeFalsy();
});

it('Can be locked', () => {
  const container = createMutableLockableContainer();
  container.lock();
  expect(container.isLocked()).toBeTruthy();
});

it('Can set a sf', () => {
  const container = createMutableLockableContainer();
  const sf = jest.fn();
  container.setService('serviceName', sf);
  expect(container.hasService('serviceName')).toBeTruthy();
  expect(container.getService('serviceName')).toBeInstanceOf(Function);
});

it('Cannot call a sf when container is unlocked', () => {
  const container = createMutableLockableContainer();
  const sf = jest.fn();
  container.setService('serviceName', sf);

  expect(() => container.getService('serviceName')()).toThrowError();
});

it('Cannot set a sf when container is locked', () => {
  const container = createMutableLockableContainer();
  container.lock();
  expect(() => container.setService('serviceName', jest.fn())).toThrowError();
});

it('Can call a sf when container is locked', () => {
  const container = createMutableLockableContainer();
  const sf = jest.fn().mockReturnValue({ foo: 'bar' });
  container.setService('serviceName', sf);
  container.lock();
  expect(container.getService('serviceName')()).toEqual({ foo: 'bar' });
});

it('service should be singleton', () => {
  const container = createMutableLockableContainer();
  const service = { foo: 'bar' };
  const sf = jest.fn().mockReturnValue(service);
  container.setService('serviceName', sf);
  container.lock();
  expect(container.getService('serviceName')()).toBe(service);
  expect(container.getService('serviceName')()).toBe(service);
  expect(sf).toBeCalledTimes(1);
});

it('Can override a service', () => {
  const container = createMutableLockableContainer();
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

it('Can get all current services', () => {
  const container = createMutableLockableContainer();
  container.setService('foo', () => 'bar');
  container.setService('John', () => 'Doe');
  const services: any = container.currentServices();
  container.setService('foo', () => 'Hallo');
  container.lock();
  expect(services.length).toEqual(2);
  expect(services[0][0]).toEqual('foo');
  expect(services[0][1]()).toEqual('bar');
  expect(services[1][0]).toEqual('John');
  expect(services[1][1]()).toEqual('Doe');
});
