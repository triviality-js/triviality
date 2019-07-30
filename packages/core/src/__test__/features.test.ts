import 'jest';
import { triviality } from '../index';
import { MyFeature } from './Features/MyFeature';
import { MyOtherFeature } from './Features/MyOtherFeature';

const TestFeature = () => ({
  services: {
    testService1: () => 'Test service 1',
  },
});

it('Can merge feature', async () => {

  const TestFeature2 = ({ testService1 }: { testService1: () => string }) => ({
    services: {
      testService3() {
        return 'Test service 3';
      },

      testService4() {
        return `test service 4 ${testService1()}`;
      },
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
