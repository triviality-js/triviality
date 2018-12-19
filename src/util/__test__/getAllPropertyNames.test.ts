import { getAllPropertyNames } from '../getAllPropertyNames';

it('Should return all property names', () => {
  const test: any = {};
  test[3] = 'test';
  test.hi = 'test2';
  expect(getAllPropertyNames(test)).toEqual(['3', 'hi']);
});
