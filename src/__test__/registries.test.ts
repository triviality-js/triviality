import { Feature } from '../Feature';
import { OptionalRegistries, triviality } from '../index';
import { Container } from '../Container';

it('A feature can define a register', async () => {

  class Feature1 implements Feature {
    public registries() {
      return {
        personListeners: () => [1],
      };
    }
  }

  const container = await triviality()
    .add(Feature1)
    .build();
  expect(container.registries().personListeners()).toEqual([1]);
});

it('A feature can fetch it\s own registers services', async () => {

  class Feature1 implements Feature {
    public registries() {
      return {
        featureVersions: (): number[] => {
          return [1, 2, 4];
        },
      };
    }

    public sum(): number {
      const numbers = this.registries().featureVersions();
      return numbers.reduce((i: number, n: number) => i + n, 0);
    }

    public multiply(): number {
      const numbers = this.registries().featureVersions();
      return numbers.reduce((i: number, n: number) => i * n, 1);
    }
  }

  const serviceContainer = await triviality()
    .add(Feature1)
    .build();
  expect(serviceContainer.sum()).toEqual(7);
  expect(serviceContainer.multiply()).toEqual(8);
});

it('A feature can fetch the registers from the container', async () => {
  class Feature1 implements Feature {
    public registries() {
      return {
        featureVersions: (): number[] => {
          return [1, 2, 4];
        },
      };
    }
  }

  class Feature2 implements Feature {

    constructor(private container: Container<Feature1>) {

    }

    public sum(): number {
      const numbers = this.container.registries().featureVersions();
      return numbers.reduce((i: number, n: number) => i + n, 0);
    }

    public multiply(): number {
      const numbers = this.container.registries().featureVersions();
      return numbers.reduce((i: number, n: number) => i * n, 1);
    }
  }

  const serviceContainer = await triviality()
    .add(Feature1)
    .add(Feature2)
    .build();
  expect(serviceContainer.sum()).toEqual(7);
  expect(serviceContainer.multiply()).toEqual(8);
});

it('Multiple feature can register to the same register', async () => {

  interface PersonEventListener {
    courtesy(event: string): string;
  }

  class ShoppingMall implements Feature {
    public registries() {
      return {
        // Template every listener should match to.
        personListeners: (): PersonEventListener[] => {
          return [];
        },
      };
    }

    public courtesies(person: string): string[] {
      return this.registries().personListeners().map((listener) => listener.courtesy(person));
    }
  }

  class Feature1 implements Feature {
    public registries() {
      return {
        personListeners: (): PersonEventListener[] => {
          return [this.halloEventListener()];
        },
      };
    }

    private halloEventListener(): PersonEventListener {
      return {
        courtesy: (event: string) => `Hallo ${event}`,
      };
    }
  }

  class Feature2 implements Feature {
    public registries() {
      return {
        personListeners: (): PersonEventListener[] => {
          return [this.byeEventListener()];
        },
      };
    }

    private byeEventListener(): PersonEventListener {
      return {
        courtesy: (event: string) => `Bye ${event}`,
      };
    }
  }

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
    .add(class Test implements Feature {
      public registries() {
        return {
          testReg: (): number[] => {
            return [];
          },
        };
      }
    })
    .build();
  expect(() => {
    ((container.registries().testReg) as any) = 1;
  }).toThrow('Container is locked and cannot be altered.');
});

it('Feature can add registry to the existing ones', async () => {

  class PersonFeature implements Feature {
    public registries() {
      return {
        persons: (): string[] => {
          return ['John', 'Jane'];
        },
      };
    }
  }

  class ShopsFeature implements Feature {
    public registries() {
      return {
        shops: (): string[] => {
          return ['KFC'];
        },
      };
    }
  }

  class MyFeature implements Feature {
    public registries(): OptionalRegistries<PersonFeature, ShopsFeature> {
      return {
        persons: (): string[] => {
          return ['Superman'];
        },
        shops: (): string[] => {
          return ['Mac'];
        },
      };
    }
  }

  class EmptyFeature implements Feature {
  }

  const container = await triviality()
    .add(PersonFeature)
    .add(ShopsFeature)
    .add(MyFeature)
    .add(EmptyFeature)
    .build();

  expect(container.registries().shops()).toEqual(['KFC', 'Mac']);
  expect(container.registries().persons()).toEqual(['John', 'Jane', 'Superman']);
});

it('Feature can have async registries', async () => {
  class MyFeature implements Feature {
    public async registries() {
      return {
        persons: (): string[] => {
          return ['Superman'];
        },
        shops: (): string[] => {
          return ['Mac'];
        },
      };
    }
  }

  const container = await triviality()
    .add(MyFeature)
    .build();

  expect(container.registries().shops()).toEqual(['Mac']);
  expect(container.registries().persons()).toEqual(['Superman']);
});

it('Async registries can fetch async services', async () => {
  const asyncService = jest.fn().mockResolvedValue({ hallo: () => 'hallo' });

  class MyFeature implements Feature {
    public async registries() {
      const halloService = await this.halloService();
      return {
        listeners: (): Array<{ hallo: () => string }> => {
          return [halloService];
        },
      };
    }

    public halloService(): Promise<{ hallo: () => string }> {
      return asyncService();
    }
  }

  const container = await triviality()
    .add(MyFeature)
    .build();

  expect(container.registries().listeners()[0].hallo()).toEqual('hallo');
});
