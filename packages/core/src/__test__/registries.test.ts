import { FeatureFactory, FF, triviality } from '../index';

it('A feature can define a register', async () => {

  interface Feature1Services {
    personListeners: number[];
  }

  const Feature1: FF<Feature1Services> = () => ({
    personListeners: () => [1],
  });

  const container = await triviality()
    .add(Feature1)
    .build();
  expect(container.personListeners).toEqual([1]);
});

it('A feature can fetch it\s own registers services', async () => {

  interface Feature1Services {
    featureVersions: number[];

    sum: number;

    multiply: number;
  }

  const Feature1: FF<Feature1Services> = ({ services, }) => {
    const { featureVersions } = services('featureVersions');
    return ({
      featureVersions: () => [1, 2, 4],
      sum: (): number => {
        const numbers = featureVersions();
        return numbers.reduce((i: number, n: number) => i + n, 0);
      },

      multiply(): number {
        const numbers = featureVersions();
        return numbers.reduce((i: number, n: number) => i * n, 1);
      },
    });
  };

  const serviceContainer = await triviality()
    .add(Feature1)
    .build();
  expect(serviceContainer.sum).toEqual(7);
  expect(serviceContainer.multiply).toEqual(8);
  expect(serviceContainer.featureVersions).toEqual([1, 2, 4]);
});

it('Multiple features can register to the same register', async () => {

  interface PersonEventListener {
    courtesy(event: string): string;
  }

  interface ShoppingMallServices {
    personListeners: PersonEventListener[];

    courtesies: (person: string) => string[];
  }

  const ShoppingMall: FF<ShoppingMallServices> = ({ instance }) => ({
    personListeners: () => [],

    courtesies(): (person: string) => string[] {
      const listeners = instance('personListeners');
      return (person) => listeners.map((listener) => listener.courtesy(person));
    },
  });

  const Feature1: FF<void, ShoppingMallServices> = ({ registers: { personListeners } }) =>
    personListeners((): PersonEventListener => ({ courtesy: (name: string) => `Hallo ${name}` }));

  const Feature2: FF<void, ShoppingMallServices> = ({ registers: { personListeners } }) =>
    personListeners((): PersonEventListener => ({ courtesy: (name: string) => `Bye ${name}` }));

  const container = await triviality()
    .add(ShoppingMall)
    .add(Feature1)
    .add(Feature2)
    .build();
  expect(container.courtesies('John')).toEqual(['Hallo John', 'Bye John']);
  expect(container.courtesies('Jane')).toEqual(['Hallo Jane', 'Bye Jane']);
  expect(container.personListeners.length).toEqual(2);
});

it('Feature can add registry to the existing ones', async () => {

  interface PersonFeatureServices {
    persons: string[];
  }

  const PersonFeature: FF<PersonFeatureServices> = () => ({
    persons: () => ['John', 'Jane'],
  });

  interface ShopFeatureServices {
    shops: string[];
  }

  const ShopsFeature: FF<ShopFeatureServices> = () => ({
    shops: () => ['KFC'],
  });

  const MyFeature: FF<void, PersonFeatureServices & ShopFeatureServices> = ({ registers: { persons, shops } }) => ({
    ...persons(() => 'Superman'),
    ...shops(() => 'Mac'),
  });

  const container = await triviality()
    .add(PersonFeature)
    .add(ShopsFeature)
    .add(MyFeature)
    .build();

  expect(container.shops).toEqual(['KFC', 'Mac']);
  expect(container.persons).toEqual(['John', 'Jane', 'Superman']);
});

it('Can create listeners', async () => {

  interface SayGoodByListenerFeatureServices {
    teardown: Array<(name: string) => string>;
    sayBye: (name: string) => string;
  }

  const sayGoodByListenerFeature: FF<SayGoodByListenerFeatureServices> = ({compose}) => {
    return ({
      teardown: compose((sayBye) => [sayBye], 'sayBye'),
      sayBye: () => (name: string) => `Bye ${name}`,
    });
  };

  interface PleaseComeBackFeatureServices {
    pleaseComeBack: (name: string) => string;
  }

  const pleaseComeBackFeature: FeatureFactory<PleaseComeBackFeatureServices, SayGoodByListenerFeatureServices> =
    ({ services, registers: { teardown } }) => ({
      pleaseComeBack: () => (name: string) => `Please come back ${name}!`,
      ...teardown(...services('pleaseComeBack')),
    });

  const container = await triviality()
    .add(sayGoodByListenerFeature)
    .add(pleaseComeBackFeature)
    .build();

  const tearDownFunctions = container.teardown;
  expect(tearDownFunctions.length).toEqual(2);
  expect(tearDownFunctions.map((service) => service('John')))
    .toEqual(['Bye John', 'Please come back John!']);
});
