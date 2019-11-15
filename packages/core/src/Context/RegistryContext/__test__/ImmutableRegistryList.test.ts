import { makeImmutableRegistryList } from '../ImmutableRegistryList';

describe('Create makeImmutableRegistryList', () => {
  it('empty', () => {
    const empty = makeImmutableRegistryList();
    expect(empty.toArray()).toEqual([]);
  });

  it('With values', () => {
    const list = makeImmutableRegistryList<number>(1, 2);
    expect(list.toArray()).toEqual([1, 2]);
  });

  it('Can iterate values', () => {
    const list = makeImmutableRegistryList<number>(1, 2);
    expect([...list]).toEqual([1, 2]);
  });
  it('Can add services to new instance', () => {
    const list = makeImmutableRegistryList<number>(1, 2);
    const withExtra = list.register(3, 4);
    expect(list.toArray()).toEqual([1, 2]);
    expect(withExtra.toArray()).toEqual([1, 2, 3, 4]);
  });
});
