import 'jest';
import { ContainerFactory, Container, Module } from '../index';
import { ContainerError } from '../ContainerError';
import { MyModule } from './Modules/MyModule';
import { MyOtherModule } from './Modules/MyOtherModule';

class TestModule {

  public testService1() {
    return ['Test service'];
  }

  public testService2(nr: number) {
    return { prop: `service ${nr}` };
  }

  public halloService(...names: string[]) {
    return { hallo: () => `Hallo ${names.join(' ')}` };
  }

}

describe('ContainerFactory', () => {

  describe('Caches services', () => {
    it('No arguments', async () => {
      const container = await ContainerFactory
        .create()
        .add(TestModule)
        .build();
      expect(container.testService1()).toBe(container.testService1());
      expect(container.testService1()).toEqual(['Test service']);
    });
    it('Takes a single argument into account', async () => {
      const container = await ContainerFactory
        .create()
        .add(TestModule)
        .build();
      expect(container.testService2(1)).toBe(container.testService2(1));
      expect(container.testService2(10)).toBe(container.testService2(10));
      expect(container.testService2(10)).not.toBe(container.testService2(1));
    });
    it('Takes multiple arguments into account', async () => {
      const container = await ContainerFactory
        .create()
        .add(TestModule)
        .build();
      expect(container.halloService('john')).toBe(container.halloService('john'));
      expect(container.halloService('john', 'jane')).toBe(container.halloService('john', 'jane'));
      expect(container.halloService('john').hallo()).toEqual('Hallo john');
      expect(container.halloService('john', 'jane').hallo()).toEqual('Hallo john jane');
    });
  });

  describe('Build', () => {
    it('Container is locked and cannot be changed', async () => {
      const container = await ContainerFactory
        .create()
        .add(TestModule)
        .build();
      expect(() => {
        (container as any).testService1 = 1;
      }).toThrow('Container is locked and cannot be altered.');
    });

    it('Cannot have name coalitions', () => {
      const containerFactory = ContainerFactory
        .create()
        .add(TestModule);
      expect(() => {
        containerFactory.add(class {
          public halloService() {
            return 'hallo world';
          }
        } as any);
      }).toThrow(ContainerError.propertyOrServiceAlreadyDefined('halloService').message);
    });

    it('Execute setup step', async () => {
      const spyConstructor = jest.fn();
      const spySetup = jest.fn();
      const container = await ContainerFactory
        .create()
        .add(class implements Module {
          constructor(private constructor: {}) {
            spyConstructor(constructor);
          }

          public setup() {
            spySetup(this.constructor);
            return Promise.resolve();
          }
        }).build();

      expect(spyConstructor).toBeCalledWith(container);
      expect(spySetup).toBeCalledWith(container);
    });
  });

  describe('Support multiple modules', () => {
    it('Can merge modules', async () => {
      class TestModule2 {

        constructor(private container: Container<TestModule>) {
        }

        public testService3() {
          return 'Test service 3';
        }

        public testService4() {
          return `test service 4 ${this.container.testService1()}`;
        }

      }

      const dependencyContainer = await ContainerFactory
        .create()
        .add(TestModule)
        .add(TestModule2)
        .build();
      expect(dependencyContainer.testService1()).toEqual(['Test service']);
      expect(dependencyContainer.testService3()).toEqual('Test service 3');
      expect(dependencyContainer.testService4()).toEqual('test service 4 Test service');
    });

    it('Can handle circular references to other modules', async () => {
      const container = await ContainerFactory
        .create()
        .add(MyModule, MyOtherModule)
        .build();
      expect(container.myModule()).toEqual('MyModule');
      expect(container.myOtherModule()).toEqual('MyOtherModule');
      expect(container.referenceToMyModule()).toEqual('MyModule');
      expect(container.referenceToMyOtherModule()).toEqual('MyOtherModule');
    });
  });

  describe('Support for service registers', () => {
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
      expect(container.personListeners()).toEqual([1]);
    });

    it('A module can fetch it\s own registers services', async () => {

      class Module1 implements Module {

        constructor(private container: Container<Module1>) {

        }

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
          const numbers = this.container.moduleVersions();
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

        public curtesies(person: string): string[] {
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

      expect(container.curtesies('John')).toEqual(['Hallo John', 'Bye John']);
      expect(container.curtesies('Jane')).toEqual(['Hallo Jane', 'Bye Jane']);
    });
  });
});
