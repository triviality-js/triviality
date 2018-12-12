import 'jest';
import { ContainerFactory, Container, Module } from '../index';
import { MyModule } from './Modules/MyModule';
import { MyOtherModule } from './Modules/MyOtherModule';
import { ContainerError } from '../ContainerError';

/* tslint:disable:max-classes-per-file */

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
        .add(TestModule)
        .build();
      expect(container.testService1()).toBe(container.testService1());
      expect(container.testService1()).toEqual(['Test service']);
    });
    it('Takes a single argument into account', async () => {
      const container = await ContainerFactory
        .add(TestModule)
        .build();
      expect(container.testService2(1)).toBe(container.testService2(1));
      expect(container.testService2(10)).toBe(container.testService2(10));
      expect(container.testService2(10)).not.toBe(container.testService2(1));
    });
    it('Takes multiple arguments into account', async () => {
      const container = await ContainerFactory
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
        .add(TestModule)
        .build();
      expect(() => {
        (container as any).testService1 = 1;
      }).toThrow('Container is locked and cannot be altered.');
    });

    it('Cannot have name coalitions', () => {
      const containerFactory = ContainerFactory.add(TestModule);
      expect(() => {
        containerFactory.add(class {
          public halloService() {
            return 'hallo world';
          }
        });
      }).toThrow(ContainerError.propertyOrServiceAlreadyDefined('halloService').message);
    });

    it('Execute setup step', async () => {
      const spyConstructor = jest.fn();
      const spySetup = jest.fn();
      const container = await ContainerFactory.add(class implements Module {
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
        .add(TestModule)
        .add(TestModule2)
        .build();
      expect(dependencyContainer.testService1()).toEqual(['Test service']);
      expect(dependencyContainer.testService3()).toEqual('Test service 3');
      expect(dependencyContainer.testService4()).toEqual('test service 4 Test service');
    });

    it('Can handle circular references to other modules', async () => {
      const container = await ContainerFactory
        .add(MyModule, MyOtherModule)
        .build();
      expect(container.myModule()).toEqual('MyModule');
      expect(container.myOtherModule()).toEqual('MyOtherModule');
      expect(container.referenceToMyModule()).toEqual('MyModule');
      expect(container.referenceToMyOtherModule()).toEqual('MyOtherModule');
    });
  });

});
