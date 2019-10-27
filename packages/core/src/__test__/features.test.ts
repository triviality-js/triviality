import 'jest';
import { FF, triviality } from '../index';
import { SF } from '../ServiceFactory';
import { MyFeature } from './Features/MyFeature';
import { MyOtherFeature } from './Features/MyOtherFeature';

interface TestFeature1Services {
  testService1: SF<string>;
}

const TestFeature: FF<TestFeature1Services> = () => ({
  testService1: () => 'Test service 1',
});

it('Can merge feature', async () => {

  interface TestFeature2Dependencies {
    testService1: SF<string>;
  }

  interface TestFeature2Services {
    testService3: SF<string>;
    testService4: SF<string>;
  }

  const TestFeature2: FF<TestFeature2Services, TestFeature2Dependencies> = ({ testService1 }: { testService1: () => string }) => ({
    testService3() {
      return 'Test service 3';
    },

    testService4() {
      return `test service 4 ${testService1()}`;
    },
  });

  const dependencyContainer = await triviality()
    .add(TestFeature)
    .add(TestFeature2)
    .build();
  expect(dependencyContainer.testService1()).toEqual('Test service 1');
  expect(dependencyContainer.testService3()).toEqual('Test service 3');
  expect(dependencyContainer.testService4()).toEqual('test service 4 Test service 1');
});

it('Feature can have different dependencies', async () => {
  const dependencyContainer = await triviality()
    .add(MyFeature)
    .add(MyOtherFeature)
    .build();
  expect(dependencyContainer.myFeature()).toEqual('MyFeature');
  expect(dependencyContainer.referenceToMyFeature()).toEqual('MyFeature');
  expect(dependencyContainer.myOtherFeature()).toEqual('MyOtherFeature');
});

it('Can inject with', async () => {

  function service(test: string): string {
    return `[${test}]`;
  }

  const SomeFeature: FF<{ test: SF<string> }, TestFeature1Services> = ({ compose }) => ({
    test: compose(service, 'testService1'),
  });

  const dependencyContainer = await triviality()
    .add(TestFeature)
    .add(SomeFeature)
    .build();

  expect(dependencyContainer.test()).toEqual('[Test service 1]');
});

it('Can inject multiple', async () => {

  const Multiple = () => ({
    service1(): string {
      return '1';
    },
    service2(): string {
      return '2';
    },
    service3(): string {
      return '3';
    },
    service4(): string {
      return '4';
    },
    service5(): string {
      return '5';
    },
    service6(): string {
      return '6';
    },
  });

  function service(...args: string[]): string {
    return args.join(',');
  }

  interface SomeFeatureInstances {
    w1: SF<string>;
    w2: SF<string>;
    w3: SF<string>;
    w4: SF<string>;
    w5: SF<string>;
    w6: SF<string>;
  }

  const SomeFeature: FF<SomeFeatureInstances, ReturnType<typeof Multiple>> = ({ compose }) => ({
    w1: compose(service, 'service1'),
    w2: compose(service, 'service1', 'service2'),
    w3: compose(service, 'service1', 'service2', 'service3'),
    w4: compose(service, 'service1', 'service2', 'service3', 'service4'),
    w5: compose(service, 'service1', 'service2', 'service3', 'service4', 'service5'),
    w6: compose(service, 'service1', 'service2', 'service3', 'service4', 'service5', 'service6'),
  });

  const dependencyContainer = await triviality()
    .add(Multiple)
    .add(SomeFeature)
    .build();

  expect(dependencyContainer.w1()).toEqual('1');
  expect(dependencyContainer.w2()).toEqual('1,2');
  expect(dependencyContainer.w3()).toEqual('1,2,3');
  expect(dependencyContainer.w4()).toEqual('1,2,3,4');
  expect(dependencyContainer.w5()).toEqual('1,2,3,4,5');
  expect(dependencyContainer.w6()).toEqual('1,2,3,4,5,6');
});
