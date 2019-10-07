import { createLockableContainer } from '../container';

it('Can create a container', () => {
  const container = createLockableContainer();
  expect(container).toBeDefined();
});

it('Is unlocked by when created', () => {
  const container = createLockableContainer();
  expect(container.isLocked()).toBeFalsy();
});

it('Can be locked', () => {
  const container = createLockableContainer();
  container.lock();
  expect(container.isLocked()).toBeTruthy();
});

it('Can set a sf', () => {
  const container = createLockableContainer();
  const sf = jest.fn();
  container.setService('serviceName', sf);
  expect(container.hasService('serviceName')).toBeTruthy();
  expect(container.getUpdatedServiceReference('serviceName')).toBeInstanceOf(Function);
});

it('Cannot call a sf when container is unlocked', () => {
  const container = createLockableContainer();
  const sf = jest.fn();
  container.setService('serviceName', sf);

  expect(() => container.getUpdatedServiceReference('serviceName')()).toThrowError();
});

it('Can call a sf when container is locked', () => {
  const container = createLockableContainer();
  const sf = jest.fn().mockReturnValue({ foo: 'bar' });
  container.setService('serviceName', sf);
  container.lock();
  expect(container.getUpdatedServiceReference('serviceName')()).toEqual({ foo: 'bar' });
});

it('service should be singleton', () => {
  const container = createLockableContainer();
  const service = { foo: 'bar' };
  const sf = jest.fn().mockReturnValue(service);
  container.setService('serviceName', sf);
  container.lock();
  expect(container.getUpdatedServiceReference('serviceName')()).toBe(service);
  expect(container.getUpdatedServiceReference('serviceName')()).toBe(service);
  expect(sf).toBeCalledTimes(1);
});

it('Can override a service', () => {
  const container = createLockableContainer();
  const service = { foo: 'bar' };
  const sf = jest.fn().mockReturnValue(service);
  container.setService('serviceName', sf);
  const service2 = { hallo: () => 1 };
  const sf2 = jest.fn().mockReturnValue(service2);
  container.setService('serviceName', sf2);
  container.lock();
  expect(container.getUpdatedServiceReference('serviceName')()).toBe(service2);
  expect(container.getUpdatedServiceReference('serviceName')()).toBe(service2);
  expect(sf).toBeCalledTimes(0);
  expect(sf2).toBeCalledTimes(1);
});
