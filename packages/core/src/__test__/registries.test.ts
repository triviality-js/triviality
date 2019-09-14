import { FF, triviality } from '../index';
import { RegistryList } from '../FeatureFactoryContext/FeatureFactoryRegistryContext/register';
import { FeatureFactory } from '../types';

it('A feature can define a register', async () => {

  interface Feature1Services {
    personListeners: RegistryList<number>;
  }

  const Feature1: FF<Feature1Services> = ({ registerList }) => ({
    personListeners: registerList([() => 1]),
  });

  const container = await triviality()
    .add(Feature1)
    .build();
  expect(container.personListeners()).toEqual([1]);
});

it('A feature can fetch it\s own registers services', async () => {

  interface Feature1Services {
    featureVersions: RegistryList<number>;

    sum(): number;

    multiply(): number;
  }

  const Feature1: FF<Feature1Services> = ({ registries, registerList }) => {
    return ({
      featureVersions: registerList<number>((): number[] => {
        return [1, 2, 4];
      }),
      sum: (): number => {
        const numbers = registries().featureVersions();
        return numbers.reduce((i: number, n: number) => i + n, 0);
      },

      multiply(): number {
        const numbers = registries().featureVersions();
        return numbers.reduce((i: number, n: number) => i * n, 1);
      },
    });
  };

  const serviceContainer = await triviality()
    .add(Feature1)
    .build();
  expect(serviceContainer.sum()).toEqual(7);
  expect(serviceContainer.multiply()).toEqual(8);
  expect(serviceContainer.featureVersions()).toEqual([1, 2, 4]);
});

it('Multiple features can register to the same register', async () => {

  interface PersonEventListener {
    courtesy(event: string): string;
  }

  interface ShoppingMallServices {
    personListeners: RegistryList<PersonEventListener>;

    courtesies(): (person: string) => string[];
  }

  const ShoppingMall: FF<ShoppingMallServices> = ({ registerList, registries }) => ({
    personListeners: registerList(),

    courtesies(): (person: string) => string[] {
      return (person) => registries().personListeners().map((listener) => listener.courtesy(person));
    },
  });

  const Feature1: FF<void, ShoppingMallServices> = ({ personListeners }) => {
    personListeners.register([(): PersonEventListener => {
      return { courtesy: (name: string) => `Hallo ${name}` };
    }]);
  };

  const Feature2: FF<void, ShoppingMallServices> = ({ personListeners }) => {
    personListeners.register([(): PersonEventListener => {
      return { courtesy: (name: string) => `Bye ${name}` };
    }]);
  };

  const container = await triviality()
    .add(ShoppingMall)
    .add(Feature1)
    .add(Feature2)
    .build();
  expect(container.courtesies()('John')).toEqual(['Hallo John', 'Bye John']);
  expect(container.courtesies()('Jane')).toEqual(['Hallo Jane', 'Bye Jane']);
  expect(container.registries().personListeners().length).toEqual(2);
});

it('registries are locked and cannot be changed', async () => {
  const container = await triviality()
    .add<{ testReg: RegistryList<number> }>(({ registerList }) => ({
      testReg: registerList((): number[] => {
        return [];
      }),
    }))
    .build();
  expect(() => {
    ((container.registries().testReg) as any) = 1;
  }).toThrow('Container is locked and cannot be altered.');
});

it('Feature can add registry to the existing ones', async () => {

  interface PersonFeatureServices {
    persons: RegistryList<string>;
  }

  const PersonFeature: FF<PersonFeatureServices> = ({ registerList }) => ({
    persons: registerList((): string[] => ['John', 'Jane']),
  });

  interface ShopFeatureServices {
    shops: RegistryList<string>;
  }

  const ShopsFeature: FF<ShopFeatureServices> = ({ registerList }) => ({
    shops: registerList((): string[] => ['KFC']),
  });

  const MyFeature: FF<void, PersonFeatureServices & ShopFeatureServices> = ({ persons, shops }) => ({
    persons: persons.register((): string[] => ['Superman']),
    shops: shops.register((): string[] => ['Mac']),
  });

  const container = await triviality()
    .add(PersonFeature)
    .add(ShopsFeature)
    .add(MyFeature)
    .build();

  expect(container.shops()).toEqual(['KFC', 'Mac']);
  expect(container.persons()).toEqual(['John', 'Jane', 'Superman']);
});

it('Can create listeners', async () => {

  interface SayGoodByListenerFeatureServices {
    teardown: RegistryList<(name: string) => string>;
    sayBye: () => (name: string) => string;
  }

  const sayGoodByListenerFeature: FF<SayGoodByListenerFeatureServices> = ({ registerList, services }) => ({
    teardown: registerList(services, 'sayBye'),
    sayBye: () => (name: string) => `Bye ${name}`,
  });

  interface PleaseComeBackFeatureServices {
    pleaseComeBack: () => (name: string) => string;
  }

  const pleaseComeBackFeature: FeatureFactory<PleaseComeBackFeatureServices> = ({ self, registerList }) => ({
    teardown: registerList([self().pleaseComeBack]),
    pleaseComeBack: () => (name: string) => `Please come back ${name}!`,
  });

  const container = await triviality()
    .add(sayGoodByListenerFeature)
    .add(pleaseComeBackFeature)
    .build();

  const tearDownFunctions = container.teardown();
  expect(tearDownFunctions.length).toEqual(2);
  expect(tearDownFunctions.map((service) => service('John')))
    .toEqual(['Bye John', 'Please come back John!']);
});
