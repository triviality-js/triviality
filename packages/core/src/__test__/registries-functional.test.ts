import { register, triviality } from '../index';

it('A feature can define a register', async () => {

  const Feature1 = () => ({
    personListeners: register(() => [1]),
  });

  const container = await triviality()
    .add(Feature1)
    .build();
  expect(container.personListeners()).toEqual([1]);
});

it('A feature can fetch it\s own registers services', async () => {
  const Feature1 = ({ registries }: { registries: () => { featureVersions: () => number[] } }) => ({
    featureVersions: register((): number[] => {
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

  const serviceContainer = await triviality()
    .add(Feature1)
    .build();
  expect(serviceContainer.sum()).toEqual(7);
  expect(serviceContainer.multiply()).toEqual(8);
});

it('Multiple features can register to the same register', async () => {

  interface PersonEventListener {
    courtesy(event: string): string;
  }

  const ShoppingMall = ({ registries }: { registries: () => { personListeners: () => PersonEventListener[] } }) => ({
    personListeners: register((): PersonEventListener[] => {
      return [];
    }),

    courtesies(person: string): string[] {
      return registries().personListeners().map((listener) => listener.courtesy(person));
    },
  });

  const Feature1 = () => ({
    personListeners: register((): PersonEventListener[] => {
      return [{ courtesy: (name: string) => `Hallo ${name}` }];
    }),
  });

  const Feature2 = () => ({
    personListeners: register((): PersonEventListener[] => {
      return [{ courtesy: (name: string) => `Bye ${name}` }];
    }),
  });

  const container = await triviality()
    .add(ShoppingMall)
    .add(Feature1)
    .add(Feature2)
    .build();
  expect(container.courtesies('John')).toEqual(['Hallo John', 'Bye John']);
  expect(container.courtesies('Jane')).toEqual(['Hallo Jane', 'Bye Jane']);
  expect(container.registries().personListeners().length).toEqual(2);
});

it('registries are locked and cannot be changed', async () => {
  const container = await triviality()
    .add(() => ({
      testReg: register((): number[] => {
        return [];
      }),
    }))
    .build();
  expect(() => {
    ((container.registries().testReg) as any) = 1;
  }).toThrow('Container is locked and cannot be altered.');
});

it('Feature can add registry to the existing ones', async () => {

  const PersonFeature = () => ({
    persons: register((): string[] => ['John', 'Jane']),
  });

  const ShopsFeature = () => ({
    shops: register((): string[] => ['KFC']),
  });

  const MyFeature = () => ({
    persons: register((): string[] => {
      return ['Superman'];
    }),
    shops: register((): string[] => {
      return ['Mac'];
    }),
  });

  const container = await triviality()
    .add(PersonFeature)
    .add(ShopsFeature)
    .add(MyFeature)
    .add(() => ({}))
    .build();

  expect(container.shops()).toEqual(['KFC', 'Mac']);
  expect(container.persons()).toEqual(['John', 'Jane', 'Superman']);
});
