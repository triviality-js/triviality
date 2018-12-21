import 'jest';
import { Container, ContainerFactory, Module } from '../index';
import { MyModule } from './Modules/MyModule';
import { MyOtherModule } from './Modules/MyOtherModule';

class TestModule implements Module {

  public testService1() {
    return ['Test service'];
  }

}

describe('ContainerFactory', () => {

  it('Can merge modules', async () => {
    class TestModule2 implements Module {

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

  it('Modules can have different dependencies', async () => {
    class TestModule1 implements Module {

      constructor(private container: Container<MyModule>) {
      }

      public testService1(): string {
        return this.container.myModule();
      }
    }

    class TestModule2 implements Module {

      constructor(private container: Container<MyOtherModule>) {
      }

      public testService2(): string {
        return this.container.myOtherModule();
      }

    }

    const dependencyContainer = await ContainerFactory
      .create()
      .add(MyModule, MyOtherModule)
      .add(TestModule1)
      .add(TestModule2)
      .build();
    expect(dependencyContainer.testService1()).toEqual('MyModule');
    expect(dependencyContainer.testService2()).toEqual('MyOtherModule');
  });
});
