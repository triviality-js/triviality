import { ImmutableRegistrySet, makeImmutableRegistrySet } from '../ImmutableRegistrySet';

describe('Create makeImmutableRegistrySet', () => {
  it('empty', () => {
    const empty = makeImmutableRegistrySet();
    expect(empty.toArray()).toEqual([]);
  });

  it('With values', () => {
    const Set = makeImmutableRegistrySet<number>(1, 2);
    expect(Set.toArray()).toEqual([1, 2]);
  });

  it('Can iterate values', () => {
    const Set = makeImmutableRegistrySet<number>(1, 2);
    expect([...Set]).toEqual([1, 2]);
  });
  it('Can add services to new instance', () => {
    const Set = makeImmutableRegistrySet<number>(1, 2);
    const withExtra = Set.register(3, 4);
    expect(Set.toArray()).toEqual([1, 2]);
    expect(withExtra.toArray()).toEqual([1, 2, 3, 4]);
  });
  it('Can only have one instance of each reference', () => {
    const Set = makeImmutableRegistrySet<number>(1, 2);
    const withExtra = Set.register(3, 4, 1, 2);
    expect(Set.toArray()).toEqual([1, 2]);
    expect(withExtra.toArray()).toEqual([1, 2, 3, 4]);
  });

  it('Should be instance of Array and makeImmutableRegistrySet', () => {
    const list = makeImmutableRegistrySet<number>(1, 2);
    expect(list).toBeInstanceOf(ImmutableRegistrySet);
    expect(list).toBeInstanceOf(Array);
  });
});
