import 'jest';
import { ContainerFactory, Container } from '../index';
import { MyModule } from './Modules/MyModule';
import { MyOtherModule } from './Modules/MyOtherModule';

/* tslint:disable:max-classes-per-file */

class TestModule {

  public testService1() {
    return ['Test service'];
  }

  public testService2(nr: number) {
    return { prop: `service ${nr}` };
  }

}

describe('createContainer', () => {

  it('Automatically compiled', async () => {
    const container = await ContainerFactory
      .add(TestModule)
      .build();
    expect(container.testService1()).toBe(container.testService1());
    expect(container.testService1()).toEqual(['Test service']);
  });

  it('Cannot alter container when it\' build', async () => {
    const container = await ContainerFactory
      .add(TestModule)
      .build();
    expect(() => {
      (container as any).testService1 = 1;
    }).toThrow();
  });

  it('Takes argument into account', async () => {
    const container = await ContainerFactory
      .add(TestModule)
      .build();
    expect(container.testService2(1)).toBe(container.testService2(1));
    expect(container.testService2(10)).toBe(container.testService2(10));
    expect(container.testService2(10)).not.toBe(container.testService2(1));
  });

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
