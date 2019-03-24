import { StoreReadModel } from '../Model/StoreReadModel';
import { StoreRepositoryInterface } from '../StoreRepositoryInterface';
import { StoreFactory } from '../../Redux/Store/StoreFactory';
import { StateReadModel } from '../Model/StateReadModel';
import { Repository } from '@triviality/eventsourcing/ReadModel/Repository';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ReadModelAction, ReadModelMetadata } from '../ReadModelAction';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INITIAL_PLAYHEAD } from '../../ValueObject/Playhead';

export class StoreRepository<
  State,
  Id extends Identity = Identity,
  Metadata extends ReadModelMetadata<Id> = ReadModelMetadata<Id>,
  Action extends ReadModelAction<Id, Metadata> = ReadModelAction<Id, Metadata>> implements StoreRepositoryInterface<State, Id, Metadata, Action> {

  constructor(private readonly stateRepository: Repository<StateReadModel<State, Id>, Id>, private readonly storeFactory: StoreFactory<State, Action>) {

  }

  public async create(id: Id): Promise<StoreReadModel<State, Id, Metadata, Action>> {
    return new StoreReadModel<State, Id, Metadata, Action>(id, this.storeFactory.create(), INITIAL_PLAYHEAD);
  }

  public save(model: StoreReadModel<State, Id, Metadata, Action>): Promise<void> {
    return this.stateRepository.save(new StateReadModel<State, Id>(
      model.getId(),
      model.getStore().getState(),
      model.getPlayhead(),
    ));
  }

  public has(id: Id): Promise<boolean> {
    return this.stateRepository.has(id);
  }

  public async get(id: Id): Promise<StoreReadModel<State, Id, Metadata, Action>> {
    const data = await this.stateRepository.get(id);
    return this.createStore(data);
  }

  public async find(id: Id): Promise<null | StoreReadModel<State, Id, Metadata, Action>> {
    const data = await this.stateRepository.find(id);
    if (data === null) {
      return null;
    }
    return this.createStore(data);
  }

  public remove(id: Id): Promise<void> {
    return this.stateRepository.remove(id);
  }

  public findAll(): Observable<StoreReadModel<State, Id, Metadata, Action>> {
    return this.stateRepository.findAll().pipe(map((data) => this.createStore(data)));
  }

  private createStore(data: StateReadModel<State, Id>) {
    const store = this.storeFactory.createFromState(data.getState() as any);
    return new StoreReadModel<State, Id, Metadata, Action>(data.getId(), store, data.getPlayhead());
  }

}
