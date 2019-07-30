import { createImmutableContainer, setNewServiceToContainer } from '../index';

describe('setNewServiceToContainer', () => {
  it('can set new services', () => {
    const container = createImmutableContainer();
    const setService = setNewServiceToContainer(container);
    const newContainer = setService('foo', () => 'bar');
    expect(newContainer.getService('foo')()).toEqual('bar');
    expect(() => container.setService('bar', ((foo: string) => foo) as any)).toThrowError();
  });

  it('Can only set new services', () => {
    const container = createImmutableContainer();
    const newContainer = container.setService('foo', () => 'bar');
    const setService = setNewServiceToContainer(newContainer);
    expect(() => setService('foo', () => 'bar!!')).toThrowError();
  });
});
