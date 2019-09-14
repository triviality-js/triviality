import { registerMap, RegistryMap } from '../registerMap';

type MyCustomService = number;

describe('Create registerMap', () => {
  it('empty', () => {
    const empty = registerMap<MyCustomService>();
    expect([...empty]).toEqual([]);
  });

  describe('Service factories', () => {
    it('tag and service factory array', () => {
      const map = registerMap([['tag1', () => 1], ['tag2', () => 2]]);
      expect([...map]).toEqual([['tag1', 1], ['tag2', 2]]);
    });
  });

  describe('With instances', () => {
    it('tag and instance array', () => {
      const map = registerMap<MyCustomService>((): Array<[string, MyCustomService]> => [['tag1', 1], ['tag2', 2]]);
      expect([...map]).toEqual([['tag1', 1], ['tag2', 2]]);
    });

    it('key tagged instance with object', () => {
      const map = registerMap<MyCustomService>(() => ({ tag1: 1, tag2: 2 }));
      expect([...map]).toEqual([['tag1', 1], ['tag2', 2]]);
    });

    it('key tagged instance with Map', () => {
      const map = registerMap<MyCustomService>(() => (new Map([['tag1', 1], ['tag2', 2]])));
      expect([...map]).toEqual([['tag1', 1], ['tag2', 2]]);
    });
  });

  describe('Service references', () => {
    describe('By tagged service array', () => {
      it('Should return a single services', () => {
        const fetchTest: (t1: 'service1') => [() => MyCustomService] = jest.fn().mockReturnValue([() => 1]);
        const map = registerMap(fetchTest, ['tag1', 'service1']);
        expect([...map]).toEqual([['tag1', 1]]);
        expect(fetchTest).toBeCalledWith('service1');
      });
      it('Should return 2 services', () => {
        const fetchTest: (t1: 'service1' | 'service2') => [() => MyCustomService] = jest.fn().mockReturnValueOnce([() => 1]).mockReturnValueOnce([() => 2]);
        const map = registerMap(fetchTest, ['tag1', 'service1'], ['tag2', 'service2']);
        expect(map()).toEqual(new Map([['tag1', 1], ['tag2', 2]]));
        expect(fetchTest).toBeCalledWith('service1');
        expect(fetchTest).toBeCalledWith('service2');
      });
    });
    describe('By tagged service object', () => {
      it('Should return a single services', () => {
        const fetchTest: (t1: 'service1') => [() => MyCustomService] = jest.fn().mockReturnValue([() => 1]);
        const map = registerMap(fetchTest, { tag1: 'service1' });
        expect([...map]).toEqual([['tag1', 1]]);
        expect(fetchTest).toBeCalledWith('service1');
      });
      it('Should return 2 services', () => {
        const fetchTest: (t1: 'service1' | 'service2') => [() => MyCustomService] = jest.fn().mockReturnValueOnce([() => 1]).mockReturnValueOnce([() => 2]);
        const map = registerMap(fetchTest, { tag1: 'service1', tag2: 'service2' });
        expect(map()).toEqual(new Map([['tag1', 1], ['tag2', 2]]));
        expect(fetchTest).toBeCalledWith('service1');
        expect(fetchTest).toBeCalledWith('service2');
      });
    });
  });
});

describe('Add to registerMap', () => {
  let map: RegistryMap<number> = null as any;
  describe('from empty one', () => {

    beforeEach(() => {
      map = registerMap();
    });

    describe('Service factories', () => {
      it('tag and service factory array', () => {
        map.register([['tag1', () => 1], ['tag2', () => 2]]);
        expect([...map]).toEqual([['tag1', 1], ['tag2', 2]]);
      });
    });

    describe('With instances', () => {
      it('tag and instance array', () => {
        map.register((): Array<[string, MyCustomService]> => [['tag1', 1], ['tag2', 2]]);
        expect([...map]).toEqual([['tag1', 1], ['tag2', 2]]);
      });

      it('key tagged instance with object', () => {
        map.register(() => ({ tag1: 1, tag2: 2 }));
        expect([...map]).toEqual([['tag1', 1], ['tag2', 2]]);
      });

      it('key tagged instance with Map', () => {
        map.register(() => (new Map([['tag1', 1], ['tag2', 2]])));
        expect([...map]).toEqual([['tag1', 1], ['tag2', 2]]);
      });
    });

    describe('Service references', () => {
      describe('By tagged service array', () => {
        it('Should return a single services', () => {
          const fetchTest: (t1: 'service1') => [() => MyCustomService] = jest.fn().mockReturnValue([() => 1]);
          map.register(fetchTest, ['tag1', 'service1']);
          expect([...map]).toEqual([['tag1', 1]]);
          expect(fetchTest).toBeCalledWith('service1');
        });
        it('Should return 2 services', () => {
          const fetchTest: (t1: 'service1' | 'service2') => [() => MyCustomService] = jest.fn().mockReturnValueOnce([() => 1]).mockReturnValueOnce([() => 2]);
          map.register(fetchTest, ['tag1', 'service1'], ['tag2', 'service2']);
          expect(map()).toEqual(new Map([['tag1', 1], ['tag2', 2]]));
          expect(fetchTest).toBeCalledWith('service1');
          expect(fetchTest).toBeCalledWith('service2');
        });
      });
      describe('By tagged service object', () => {
        it('Should return a single services', () => {
          const fetchTest: (t1: 'service1') => [() => MyCustomService] = jest.fn().mockReturnValue([() => 1]);
          map.register(fetchTest, { tag1: 'service1' });
          expect([...map]).toEqual([['tag1', 1]]);
          expect(fetchTest).toBeCalledWith('service1');
        });
        it('Should return 2 services', () => {
          const fetchTest: (t1: 'service1' | 'service2') => [() => MyCustomService] = jest.fn().mockReturnValueOnce([() => 1]).mockReturnValueOnce([() => 2]);
          map.register(fetchTest, { tag1: 'service1', tag2: 'service2' });
          expect(map()).toEqual(new Map([['tag1', 1], ['tag2', 2]]));
          expect(fetchTest).toBeCalledWith('service1');
          expect(fetchTest).toBeCalledWith('service2');
        });
      });
    });
  });

  describe('from existing one', () => {
    beforeEach(() => {
      map = registerMap([['tag1', () => 1], ['tag2', () => 2]]);
    });
    it('Should add services to array', () => {
      map.register([['tag3', () => 3], ['tag4', () => 4]]);
      expect([...map]).toEqual([['tag1', 1], ['tag2', 2], ['tag3', 3], ['tag4', 4]]);
    });
  });
});
