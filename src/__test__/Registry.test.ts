import { mergeRegistries, mergeRegistryValues } from '../Registry';

describe('mergeRegistries', () => {
  it('Can create new index', () => {
    const registry1 = () => [1, 2];
    const registry2 = () => ({ John: 23, Jane: 21 });

    const merged = mergeRegistries({}, {
      registry1,
      registry2,
    });
    expect(merged).toEqual({
      registry1: [registry1],
      registry2: [registry2],
    });
  });

  it('Add to existing indexes', () => {

    const registry1 = () => [1, 2];
    const registry2 = () => ({ John: 23, Jane: 21 });

    const merged = mergeRegistries(
      {
        registry1: [registry1],
        registry2: [registry2],
      },
      {
        registry1,
        registry2,
      },
    );
    expect(merged).toEqual({
      registry1: [registry1, registry1],
      registry2: [registry2, registry2],
    });
  });

});

describe('mergeRegistryValues', () => {

  it('Cannot be empty', () => {
    expect(() => mergeRegistryValues([])).toThrow('Register return type should be an array or object');
  });

  it('Cannot be boolean', () => {
    expect(() => mergeRegistryValues([true as any])).toThrow('Register return type should be an array or object');
  });

  it('Cannot be undefined', () => {
    expect(() => mergeRegistryValues([undefined as any])).toThrow('Register return type should be an array or object');
  });

  describe('array', () => {
    it('Combines nested arrays', () => {
      expect(mergeRegistryValues([[1, 2], [3], [4]])).toEqual([1, 2, 3, 4]);
    });

    it('Cannot have objects', () => {
      expect(() => mergeRegistryValues([[1, 2], {}])).toThrow('Register with same name should return the same type');
    });

    it('Cannot be undefined', () => {
      expect(() => mergeRegistryValues([[1, 2], undefined as any])).toThrow('Register with same name should return the same type');
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
      expect(() => mergeRegistryValues([{ hallo: 'world' }, []])).toThrow('Register with same name should return the same type');
    });

    it('Cannot have undefined', () => {
      expect(() => mergeRegistryValues([{ hallo: 'world' }, undefined as any])).toThrow('Register with same name should return the same type');
    });
  });
});
