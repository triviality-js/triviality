import 'jest';
import { triviality, Module } from '../index';

it('Should still be able to use deprecated module interface ', async () => {
  class TestModule implements Module {

    public testService() {
      return {
        test: 1,
      };
    }

  }

  const dependencyContainer = await triviality()
    .add(TestModule)
    .build();
  expect(dependencyContainer.testService()).toEqual({ test: 1 });
});
