import 'jest';
import { FF, triviality } from '../index';
import { MyFeature } from './Features/MyFeature';
import { MyOtherFeature } from './Features/MyOtherFeature';

interface TestFeature1Services {
  testService1: string;
}

const TestFeature: FF<TestFeature1Services> = () => ({
  testService1: () => 'Test service 1',
});

it('Can merge feature', async () => {

  interface TestFeature2Dependencies {
    testService1: string;
  }

  interface TestFeature2Services {
    testService3: string;
    testService4: string;
  }

  const TestFeature2: FF<TestFeature2Services, TestFeature2Dependencies> = ({ instance }) => ({
    testService3() {
      return 'Test service 3';
    },

    testService4() {
      return `test service 4 ${instance('testService1')}`;
    },
  });

  const dependencyContainer = await triviality()
    .add(TestFeature)
    .add(TestFeature2)
    .build();
  expect(dependencyContainer.testService1).toEqual('Test service 1');
  expect(dependencyContainer.testService3).toEqual('Test service 3');
  expect(dependencyContainer.testService4).toEqual('test service 4 Test service 1');
});

it('Feature can have different dependencies', async () => {
  const dependencyContainer = await triviality()
    .add(MyFeature)
    .add(MyOtherFeature)
    .build();
  expect(dependencyContainer.myFeature).toEqual('MyFeature');
  expect(dependencyContainer.referenceToMyFeature).toEqual('MyFeature');
  expect(dependencyContainer.myOtherFeature).toEqual('MyOtherFeature');
});

it('Can inject with', async () => {

  function service(test: string): string {
    return `[${test}]`;
  }

  const SomeFeature: FF<{ test: string }, TestFeature1Services> = ({ compose }) => ({
    test: compose(service, 'testService1'),
  });

  const dependencyContainer = await triviality()
    .add(TestFeature)
    .add(SomeFeature)
    .build();

  expect(dependencyContainer.test).toEqual('[Test service 1]');
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
    w1: string;
    w2: string;
    w3: string;
    w4: string;
    w5: string;
    w6: string;
  }

  interface SomeFeatureDependencies {
    service1: string;
    service2: string;
    service3: string;
    service4: string;
    service5: string;
    service6: string;
  }

  const SomeFeature: FF<SomeFeatureInstances, SomeFeatureDependencies> = ({ compose }) => ({
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

  expect(dependencyContainer.w1).toEqual('1');
  expect(dependencyContainer.w2).toEqual('1,2');
  expect(dependencyContainer.w3).toEqual('1,2,3');
  expect(dependencyContainer.w4).toEqual('1,2,3,4');
  expect(dependencyContainer.w5).toEqual('1,2,3,4,5');
  expect(dependencyContainer.w6).toEqual('1,2,3,4,5,6');
});
