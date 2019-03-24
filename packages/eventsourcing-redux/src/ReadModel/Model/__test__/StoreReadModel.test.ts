import { StoreReadModel } from '../StoreReadModel';
import { Store } from 'redux';
import { ScalarIdentity } from '@triviality/eventsourcing/ValueObject/ScalarIdentity';
import { ReadModelAction } from '../../ReadModelAction';

it('Can create a StoreReadModel', () => {
  const store: Store<string, ReadModelAction> = {} as any;
  const model = new StoreReadModel<string, any>(new ScalarIdentity(1), store, 0);
  expect(model.getPlayhead()).toEqual(0);
  expect(model.getStore()).toEqual(store);
  expect(model.getId().getValue()).toEqual(1);
});
