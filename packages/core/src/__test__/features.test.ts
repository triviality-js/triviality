import 'jest';
import { Container, triviality, Feature } from '../index';
import { MyFeature } from './Features/MyFeature';
import { MyOtherFeature } from './Features/MyOtherFeature';

class TestFeature implements Feature {

  public testService1() {
    return ['Test service'];
  }

}

it('Can merge feature', async () => {
  class TestFeature2 implements Feature {

    constructor(private container: Container<TestFeature>) {
    }

    public testService3() {
      return 'Test service 3';
    }

    public testService4() {
      return `test service 4 ${this.container.testService1()}`;
    }

  }

  const dependencyContainer = await triviality()
    .add(TestFeature)
    .add(TestFeature2)
    .build();
  expect(dependencyContainer.testService1()).toEqual(['Test service']);
  expect(dependencyContainer.testService3()).toEqual('Test service 3');
  expect(dependencyContainer.testService4()).toEqual('test service 4 Test service');
});

it('Can handle circular references to other feature', async () => {
  const container = await triviality()
    .add(MyFeature, MyOtherFeature)
    .build();
  expect(container.myFeature()).toEqual('MyFeature');
  expect(container.myOtherFeature()).toEqual('MyOtherFeature');
  expect(container.referenceToMyFeature()).toEqual('MyFeature');
  expect(container.referenceToMyOtherFeature()).toEqual('MyOtherFeature');
});

it('Feature can have different dependencies', async () => {
  class TestFeature1 implements Feature {

    constructor(private container: Container<MyFeature>) {
    }

    public testService1(): string {
      return this.container.myFeature();
    }
  }

  class TestFeature2 implements Feature {

    constructor(private container: Container<MyOtherFeature>) {
    }

    public testService2(): string {
      return this.container.myOtherFeature();
    }

  }

  const dependencyContainer = await triviality()
    .add(MyFeature, MyOtherFeature)
    .add(TestFeature1)
    .add(TestFeature2)
    .build();
  expect(dependencyContainer.testService1()).toEqual('MyFeature');
  expect(dependencyContainer.testService2()).toEqual('MyOtherFeature');
});
