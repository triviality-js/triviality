import { makeImmutableRegistryMap } from '../ImmutableRegistryMap';

describe('Create makeImmutableRegistryMap', () => {
  it('empty', () => {
    const empty = makeImmutableRegistryMap<number>();
    expect(empty.toArray()).toEqual([]);
  });
  it('With tagged services', () => {
    const map = makeImmutableRegistryMap<number>(['tag1', 1], ['tag2', 2]);
    expect(map.toArray()).toEqual([['tag1', 1], ['tag2', 2]]);
  });
  it('Can iterate values', () => {
    const map = makeImmutableRegistryMap<number>(['tag1', 1], ['tag2', 2]);
    expect([...map]).toEqual([['tag1', 1], ['tag2', 2]]);
  });
  it('Can add values', () => {
    const map = makeImmutableRegistryMap<number>(['tag1', 1], ['tag2', 2]);
    expect([...map.register(['tag1', 3], ['tag4', 4])]).toEqual([['tag1', 3], ['tag2', 2], ['tag4', 4]]);
    expect(map.toArray()).toEqual([['tag1', 1], ['tag2', 2]]);
  });
});
