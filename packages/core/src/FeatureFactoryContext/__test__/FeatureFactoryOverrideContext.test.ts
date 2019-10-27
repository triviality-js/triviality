import { createMutableLockableContainer } from '../../container';
import { composeOverride, overrideService } from '../FeatureFactoryOverrideContext';

describe('overrideService', () => {
  it('Can only override excising services', () => {
    const container = createMutableLockableContainer();
    expect(() => overrideService(
      container,
      'a',
      jest.fn(),
    )).toThrowError();
  });

  it('Can override dependencies', () => {
    const container = createMutableLockableContainer();
    const mock = jest.fn().mockReturnValue('foo');
    container.setService('foo', mock);
    const overrideMock = jest.fn().mockReturnValue('bar');
    const [old, service] = overrideService(
      container,
      'foo',
      overrideMock,
    );
    container.lock();
    expect(container.getService('foo')()).toEqual('bar');
    expect(old()).toEqual('foo');
    expect(service()).toEqual('bar');
    expect(mock).toBeCalledTimes(1);
    expect(overrideMock).toBeCalledTimes(1);
  });
});

describe('composeOverride', () => {
  it('composeOverride can only override excising services', () => {
    const container = createMutableLockableContainer();
    expect(() => composeOverride(
      container,
      'a',
      jest.fn(),
    )).toThrowError();
  });

  it('Can compose a override', () => {
    const container = createMutableLockableContainer();
    const mock = jest.fn().mockReturnValue('foo');
    container.setService('a', () => '1');
    container.setService('b', () => '2');
    const [original, override] = composeOverride(
      container,
      'a',
      mock,
      'a',
      'b',
    );
    container.lock();
    expect(original()).toEqual('1');
    expect(override()).toEqual('foo');
    expect(container.getService('a')()).toEqual('foo');

    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith('1', '2');
  });

});
