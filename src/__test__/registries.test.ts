import { Module } from '../Module';
import { ContainerFactory } from '../ContainerFactory';

describe('ContainerFactory', () => {
  it('A module can define a register', async () => {

    class Module1 implements Module {
      public registries() {
        return {
          personListeners: () => [1],
        };
      }
    }

    const container = await ContainerFactory
      .create()
      .add(Module1)
      .build();
    expect(container.registries().personListeners()).toEqual([1]);
  });

  it('A module can fetch it\s own registers services', async () => {

    class Module1 implements Module {
      public registries() {
        return {
          moduleVersions: (): number[] => {
            return [1, 2, 4];
          },
        };
      }

      public sum(): number {
        const numbers = this.registries().moduleVersions();
        return numbers.reduce((i: number, n: number) => i + n, 0);
      }

      public multiply(): number {
        const numbers = this.registries().moduleVersions();
        return numbers.reduce((i: number, n: number) => i * n, 1);
      }
    }

    const serviceContainer = await ContainerFactory
      .create()
      .add(Module1)
      .build();
    expect(serviceContainer.sum()).toEqual(7);
    expect(serviceContainer.multiply()).toEqual(8);
  });

  it('Multiple modules can register to the same register', async () => {

    interface PersonEventListener {
      courtesy(event: string): string;
    }

    class ShoppingMall implements Module {
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

    class Module1 implements Module {
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

    class Module2 implements Module {
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

    const container = await ContainerFactory
      .create()
      .add(ShoppingMall)
      .add(Module1)
      .add(Module2)
      .build();
    expect(container.courtesies('John')).toEqual(['Hallo John', 'Bye John']);
    expect(container.courtesies('Jane')).toEqual(['Hallo Jane', 'Bye Jane']);
    expect(container.registries().personListeners().length).toEqual(2);
  });

  it('registries is locked and cannot be changed', async () => {
    const container = await ContainerFactory
      .create()
      .add(class Test implements Module {
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
});
