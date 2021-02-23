import {ServiceContainerFactory, FC, FF, ServicesAsFactories} from "@triviality/core";
import {fromPairs, toPairs} from "lodash";

async function testFeatureFactory<S, D>(ff: FF<S, D>, dependencies: D, contextHook?: (context: FC<S, D>) => void): Promise<S & D> {
  const services = fromPairs(toPairs(dependencies as Record<string, unknown>).map(([tag, service]) => {
    return [tag, () => service];
  })) as ServicesAsFactories<D>;
  const dependencyFeature: FF<D> = () => services;
  return ServiceContainerFactory.create()
    .add(dependencyFeature)
    .add(ff)
    .add((context) => {
      if (contextHook) {
        contextHook(context as unknown as FC<S, D>);
      }
      return {};
    })
    .build() as Promise<S & D>;
}

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
      const MyFeature: FF<{ that: jest.Mock }, { dep: jest.Mock }> = ({ dependencies: {dep} }) => {
        return {
          that: () => dep(),
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
      const MyFeature: FF<{ name: string, myFullNameWithAge: string }, { age: number }> = ({ compose }) => {
        return {
          name: () => 'Eric',
          myFullNameWithAge: compose((age, name) => `${name} Pinxteren ${age}`, 'age', 'name'),
        };
      };

      const result = await testFeatureFactory(MyFeature, { age: 32 });

      expect(result.myFullNameWithAge).toEqual('Eric Pinxteren 32');
    });

    it('Services should be memorized', async () => {
      const MyFeature: FF<{ foo: number }, { bar: jest.Mock<number> }> = ({ dependencies: {bar} }) => {
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
