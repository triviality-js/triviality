import { FF } from '../../FeatureFactory';
import { SF } from '../../ServiceFactory';
import { testFeatureFactory } from '../../testFeatureFactory';

describe('FeatureFactoryContext', () => {
  describe('Direct dependencies', () => {
    it('Can be given as argument', () => {
      interface MyFeatureServices {
        specialNumber: () => number;
      }

      interface MyFeatureDependencies {
        otherSpecialNumber: () => number;
      }

      const SpecialNumberTwice = (i: number) => i * 2;
      const MyFeature: FF<MyFeatureServices, MyFeatureDependencies> = ({ otherSpecialNumber }) => ({
        specialNumber: () => SpecialNumberTwice(otherSpecialNumber()),
      });

      const result = testFeatureFactory(MyFeature, { otherSpecialNumber: jest.fn(() => 1) as any });
      expect(result.specialNumber()).toEqual(2);
    });
    it('Services should be memorized', () => {
      const MyFeature: FF<{ that: SF<jest.Mock> }, { dep: SF<jest.Mock> }> = ({ dep }) => {
        return {
          that: () => dep(),
        };
      };
      const mock = jest.fn();
      const dependencies = { dep: jest.fn(() => mock) as any };
      const result = testFeatureFactory(MyFeature, dependencies);
      // Should not return new instances of mock object.
      expect(result.that()).toBe(dependencies.dep());
      expect(dependencies.dep).toBeCalledTimes(2);
    });
  });

  describe('Services', () => {
    it('Can fetch own and depended service factories', () => {
      const MyFeature: FF<{ name: SF<string>, myFullNameWithAge: SF<string> }, { age: SF<number> }> = ({ services }) => {
        const { age, name } = services('age', 'name');
        return {
          name: () => 'Eric',
          myFullNameWithAge: () => `${name()} Pinxteren ${age()}`,
        };
      };

      const result = testFeatureFactory(MyFeature, { age: jest.fn(() => 32) as any });

      expect(result.myFullNameWithAge()).toEqual('Eric Pinxteren 32');
    });

    it('Services should be memorized', () => {
      const MyFeature: FF<{ foo: SF<jest.Mock> }, { bar: SF<jest.Mock> }> = ({ services }) => {
        const { bar } = services('bar');
        return {
          foo: () => bar(),
        };
      };

      const dependencies = { bar: jest.fn() as any };
      const result = testFeatureFactory(MyFeature, dependencies);

      // Should not return new instances of mock object.
      expect(result.foo()).toBe(dependencies.bar());
    });
  });

  describe('Compose', () => {
    it('Can create new service factory with service tags ', () => {
      interface MyFeatureServices {
        specialNumber: () => number;
      }

      interface MyFeatureDependencies {
        otherSpecialNumber: () => number;
      }

      const SpecialNumberTwice = (i: number): number => i * 2;

      const MyFeature: FF<MyFeatureServices, MyFeatureDependencies> = ({ compose }): MyFeatureServices => ({
        specialNumber: compose(SpecialNumberTwice, 'otherSpecialNumber'),
      });

      const result = testFeatureFactory(MyFeature, { otherSpecialNumber: jest.fn(() => 1) as any });

      expect(result.specialNumber()).toEqual(2);
    });
  });

});
