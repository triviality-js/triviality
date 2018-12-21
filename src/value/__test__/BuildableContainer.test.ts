import { BuildableContainer } from '../BuildableContainer';

it('Can fetch empty register from module without registers', () => {
  const bc = new BuildableContainer({});
  expect(() => bc.overrideService('someExtraService', 1)).toThrow('Cannot add extra service "someExtraService" with serviceOverrides');
});
