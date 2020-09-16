import { FF } from '../../FeatureFactory';
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
      const MyFeature: FF<MyFeatureServices, MyFeatureDependencies> = ({ compose }) => ({
        specialNumber: compose(SpecialNumberTwice, 'otherSpecialNumber'),
      });

      const result = await testFeatureFactory(MyFeature, { otherSpecialNumber: 1 });
      expect(result.specialNumber).toEqual(2);
    });
    it('Services should be memorized', async () => {
      const MyFeature: FF<{ that: jest.Mock }, { dep: jest.Mock }> = ({ service }) => {
        return {
          that: service('dep'),
        };
      };
      const mock = jest.fn(() => ({}));
      const dependencies = { dep: mock };
      const result = await testFeatureFactory(MyFeature, dependencies);
      // Should not return new instances of mock object.
      expect(result.that).toBe(dependencies.dep);
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

      const result = await testFeatureFactory(MyFeature, { age: 32 });

      expect(result.myFullNameWithAge).toEqual('Eric Pinxteren 32');
    });

    it('Services should be memorized', async () => {
      const MyFeature: FF<{ foo: number }, { bar: jest.Mock<number> }> = ({ service }) => {
        const bar  = service('bar');
        return {
          foo: () => bar()(),
        };
      };

      const dependencies = { bar: jest.fn(() => 1) };
      const result = await testFeatureFactory(MyFeature, dependencies);

      // Should not return new instances of mock object.
      expect(result.foo).toBe(1);
      expect(result.foo).toBe(1);
      expect(result.bar).toBeCalledTimes(1);
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

      const result = await testFeatureFactory(MyFeature, { otherSpecialNumber: 1 });

      expect(result.specialNumber).toEqual(2);
    });
  });

});
