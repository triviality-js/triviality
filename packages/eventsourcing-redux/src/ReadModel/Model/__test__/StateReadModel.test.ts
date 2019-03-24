import { StateReadModel } from '../StateReadModel';
import { ScalarIdentity } from '@triviality/eventsourcing/ValueObject/ScalarIdentity';

it('Can create a StateReadModel', () => {
  const model = new StateReadModel(new ScalarIdentity(1), 'test', 0);
  expect(model.getPlayhead()).toEqual(0);
  expect(model.getState()).toEqual('test');
  expect(model.getId().getValue()).toEqual(1);
});
