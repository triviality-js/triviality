import { FF } from '../../FeatureFactory';
import { SF } from '../../ServiceFactory';
import { testFeatureFactory } from '../../testing';

describe('FeatureFactoryContext', () => {
  describe('Direct dependencies', () => {
    it('Can be given as argument', async () => {
      interface MyFeatureServices {
        specialNumber: number;
      }

      interface MyFeatureDependencies {
        otherSpecialNumber: number;
      }

      const SpecialNumberTwice = (i: number) => i * 2;
      const MyFeature: FF<MyFeatureServices, MyFeatureDependencies> = ({ otherSpecialNumber }) => ({
        specialNumber: () => SpecialNumberTwice(otherSpecialNumber()),
      });

      const result = await testFeatureFactory(MyFeature, { otherSpecialNumber: jest.fn(() => 1) as any });
      expect(result.specialNumber).toEqual(2);
    });
    it('Services should be memorized', async () => {
      const MyFeature: FF<{ that: jest.Mock }, { dep: jest.Mock }> = ({ dep }) => {
        return {
          that: () => dep(),
        };
      };
      const mock = jest.fn();
      const dependencies = { dep: jest.fn(() => mock) as any };
      const result = await testFeatureFactory(MyFeature, dependencies);
      // Should not return new instances of mock object.
      expect(result.that).toBe(dependencies.dep());
      expect(dependencies.dep).toBeCalledTimes(2);
    });
  });

  describe('Services', () => {
    it('Can fetch own and depended service factories', async () => {
      const MyFeature: FF<{ name: string, myFullNameWithAge: string }, { age: number }> = ({ services }) => {
        const { age, name } = services('age', 'name');
        return {
          name: () => 'Eric',
          myFullNameWithAge: () => `${name()} Pinxteren ${age()}`,
        };
      };

      const result = await testFeatureFactory(MyFeature, { age: jest.fn(() => 32) as any });

      expect(result.myFullNameWithAge).toEqual('Eric Pinxteren 32');
    });

    it('Services should be memorized', async () => {
      const MyFeature: FF<{ foo: SF<jest.Mock> }, { bar: SF<jest.Mock> }> = ({ services }) => {
        const { bar } = services('bar');
        return {
          foo: () => bar(),
        };
      };

      const dependencies = { bar: jest.fn() as any };
      const result = await testFeatureFactory(MyFeature, dependencies);

      // Should not return new instances of mock object.
      expect(result.foo).toBe(dependencies.bar());
    });
  });

  describe('Compose', () => {
    it('Can create new service factory with service tags ', async () => {
      interface MyFeatureServices {
        specialNumber: number;
      }

      interface MyFeatureDependencies {
        otherSpecialNumber: number;
      }

      const SpecialNumberTwice = (i: number): number => i * 2;

      const MyFeature: FF<MyFeatureServices, MyFeatureDependencies> = ({ compose }) => ({
        specialNumber: compose(SpecialNumberTwice, 'otherSpecialNumber'),
      });

      const result = await testFeatureFactory(MyFeature, { otherSpecialNumber: jest.fn(() => 1) as any });

      expect(result.specialNumber).toEqual(2);
    });
  });

});
