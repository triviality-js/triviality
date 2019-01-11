import { getAllPropertyNames } from '../getAllPropertyNames';

it('Should return all property names', () => {
  const test: any = {};
  test[3] = 'test';
  test.hi = 'test2';
  expect(getAllPropertyNames(test)).toEqual(['3', 'hi']);
});

it('Should return all property names of extended classes', () => {
  class Test {
    public baseProp = 1;

    public func() {
      // noop.
    }
  }
  class ExtendedTest extends Test {
    public extendProp = 2;

    public extendedFunc() {
      // noop.
    }
  }

  class DeepExtendedTest extends ExtendedTest {
    public deepExtendProp = 3;

    public deepExtendedFunc() {
      // noop.
    }
  }
  expect(getAllPropertyNames(new DeepExtendedTest())).toEqual([
    'baseProp',
    'extendProp',
    'deepExtendProp',
    'deepExtendedFunc',
    'extendedFunc',
    'func',
  ]);
});
