import { BuildableContainer } from '../../Buildable/BuildableContainer';

it('Can fetch empty register from feature without registers', () => {
  const bc = new BuildableContainer();
  expect(() => bc.overrideService('someExtraService', 1)).toThrow('Cannot add extra service "someExtraService" with serviceOverrides');
});
