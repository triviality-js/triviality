import { mergeRegistries, mergeRegistryValues } from '../Registry';

describe('mergeRegistries', () => {
  it('Can create new index', () => {
    const registry1 = () => [1, 2];
    const registry2 = () => ({ John: 23, Jane: 21 });
    const registry3 = () => undefined;

    const merged = mergeRegistries({}, {
      registry1,
      registry2,
      registry3,
    });
    expect(merged).toEqual({
      registry1: [registry1],
      registry2: [registry2],
      registry3: [registry3],
    });
  });

  it('Add to existing indexes', () => {

    const registry1 = () => [1, 2];
    const registry2 = () => ({ John: 23, Jane: 21 });
    const registry3 = () => undefined;

    const merged = mergeRegistries(
      {
        registry1: [registry1],
        registry2: [registry2],
        registry3: [registry3],
      },
      {
        registry1,
        registry2,
        registry3,
      },
    );
    expect(merged).toEqual({
      registry1: [registry1, registry1],
      registry2: [registry2, registry2],
      registry3: [registry3, registry3],
    });
  });

});

describe('mergeRegistryValues', () => {

  it('Cannot be empty', () => {
    expect(() => mergeRegistryValues([])).toThrow('Register should return array, object or nothing (void)');
  });

  it('Cannot be empty', () => {
    expect(() => mergeRegistryValues([true as any])).toThrow('Register should return array, object or nothing (void)');
  });

  describe('array', () => {
    it('Combines nested arrays', () => {
      expect(mergeRegistryValues([[1, 2], [3], [4]])).toEqual([1, 2, 3, 4]);
    });

    it('Cannot have objects', () => {
      expect(() => mergeRegistryValues([[1, 2], {}])).toThrow('Register should return same type');
    });

    it('Cannot have undefined', () => {
      expect(() => mergeRegistryValues([[1, 2], undefined])).toThrow('Register should return same type');
    });
  });

  describe('object', () => {
    it('Combines objects', () => {
      expect(mergeRegistryValues([{ hallo: 'world' }, { foo: 1, bar: -1 }])).toEqual({
        hallo: 'world',
        foo: 1,
        bar: -1,
      });
    });

    it('Cannot have array', () => {
      expect(() => mergeRegistryValues([{ hallo: 'world' }, []])).toThrow('Register should return same type');
    });

    it('Cannot have undefined', () => {
      expect(() => mergeRegistryValues([{ hallo: 'world' }, undefined])).toThrow('Register should return same type');
    });
  });

  describe('undefined', () => {
    it('Combines objects', () => {
      expect(mergeRegistryValues([undefined, undefined])).toEqual(undefined);
    });

    it('Cannot have array', () => {
      expect(() => mergeRegistryValues([undefined, []])).toThrow('Register should return same type');
    });

    it('Cannot have object', () => {
      expect(() => mergeRegistryValues([undefined, {}])).toThrow('Register should return same type');
    });
  });
});
