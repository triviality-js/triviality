import { registerList, RegistryList } from '../registerList';

type MyCustomService = number;

describe('Create registerList', () => {
  it('empty', () => {
    const empty = registerList();
    expect([...empty]).toEqual([]);
  });

  describe('with array of service factories', () => {
    it('Should return values', () => {
      const list = registerList([() => 1, () => 2]);
      expect([...list]).toEqual([1, 2]);
    });
  });

  describe('with instances', () => {
    it('Should return values', () => {
      const list = registerList(() => [1, 2]);
      expect([...list]).toEqual([1, 2]);
    });
  });

  describe('Service references', () => {

    it('Should return a single services', () => {
      const fetchTest: (t1: 'service1') => [() => MyCustomService] = jest.fn().mockReturnValue([() => 1]);
      const list = registerList(fetchTest, 'service1');
      expect([...list]).toEqual([1]);
      expect(fetchTest).toBeCalledWith('service1');
    });
    it('Should return 2 services', () => {
      const fetchTest: (t1: 'service1' | 'service2') => [() => MyCustomService] = jest.fn().mockReturnValueOnce([() => 1]).mockReturnValueOnce([() => 2]);
      const list = registerList(fetchTest, 'service1', 'service2');
      expect([...list]).toEqual([1, 2]);
      expect(fetchTest).toBeCalledWith('service1');
      expect(fetchTest).toBeCalledWith('service2');
    });

  });
});

describe('Add to registerList', () => {
  let list: RegistryList<number> = null as any;
  describe('from empty one', () => {

    beforeEach(() => {
      list = registerList();
    });

    describe('with array of service factories', () => {
      it('Should return values', () => {
        list.register([() => 1, () => 2]);
        expect([...list]).toEqual([1, 2]);
      });
    });

    describe('with instances', () => {
      it('Should return values', () => {
        list.register(() => [1, 2]);
        expect([...list]).toEqual([1, 2]);
      });
    });

    describe('Service references', () => {
      it('Should return a single services', () => {
        const fetchTest: (t1: 'service1') => [() => number] = jest.fn().mockReturnValue([() => 1]);
        list.register(fetchTest, 'service1');
        expect([...list]).toEqual([1]);
        expect(fetchTest).toBeCalledWith('service1');
      });
      it('Should return multiple services', () => {
        const fetchTest: (t1: 'service1' | 'service2') => [() => MyCustomService] = jest.fn().mockReturnValueOnce([() => 1]).mockReturnValueOnce([() => 2]);
        list.register(fetchTest, 'service1', 'service2');
        expect([...list]).toEqual([1, 2]);
        expect(fetchTest).toBeCalledWith('service1');
        expect(fetchTest).toBeCalledWith('service2');
      });
    });
  });
});
