import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { Record } from 'immutable';
import { ReadModelTestContext } from '@triviality/eventsourcing/Testing';
import { StateReadModel } from '../../ReadModel/Model/StateReadModel';
import { SimpleStoreFactory } from '../../Redux/Store/SimpleStoreFactory';
import { ReadModelAction } from '../../ReadModel/ReadModelAction';
import { InMemoryRepository } from '@triviality/eventsourcing/ReadModel/InMemoryRepository';
import { StoreRepository } from '../../ReadModel/Repository/StoreRepository';
import { ActionWithSnapshotRepository } from '../../ReadModel/Repository/ActionWithSnapshotRepository';
import { InMemoryActionRepository } from '../../ReadModel/Repository/InMemoryActionRepository';
import { GateWayFactoryMock } from '../GateWayFactoryMock';
import { Reducer } from 'redux';
import { SerializableAction } from '../../Redux/SerializableAction';

export class ReduxReadModelTestContext<Id extends Identity, State extends Record<any>> extends ReadModelTestContext<StateReadModel<State, Id>> {
  public storeFactory = new SimpleStoreFactory<State, ReadModelAction<Id>>(this.reducer);
  public stateRepository = new InMemoryRepository<StateReadModel<State, Id>, Id>();
  public storeRepository = new StoreRepository<State, Id>(
    this.stateRepository,
    this.storeFactory,
  );
  public actionSnapShotRepository = new ActionWithSnapshotRepository<State, Id>(
    new InMemoryActionRepository<State, Id>(this.storeFactory),
    this.storeRepository,
  );
  public gatewayFactory: GateWayFactoryMock<State, Id, any> = new GateWayFactoryMock(this.actionSnapShotRepository);

  constructor(
    public state: State,
    public reducer: Reducer<State, SerializableAction>,
  ) {
    super();
    this.setRepository(this.stateRepository);
  }

}
