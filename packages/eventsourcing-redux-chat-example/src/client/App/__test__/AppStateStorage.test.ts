import { AccountState } from '../../Account/AcountState';
import { serviceContainerFactory } from '../../ServiceContainer';
import { StoreState } from '../../StoreState';
import { AppState } from '../AppState';

it('should be able to fetch data when there is none', async () => {
  const container = await serviceContainerFactory().build();
  const store = container.valueStore();
  const state: StoreState = store.get()!;
  expect(state.account).toEqual(new AccountState());
  expect(state.app).toEqual(new AppState());
});
