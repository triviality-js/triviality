import { StoreReadModel } from '../Model/StoreReadModel';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ReadModelAction, ReadModelMetadata } from '../ReadModelAction';
import { tap } from 'rxjs/operators';
import { ActionRepositoryInterface } from '../ActionRepositoryInterface';
import { ActionStream } from '../ActionStream';
import { StoreRepository } from './StoreRepository';
import { Observable } from 'rxjs';

export class ActionWithSnapshotRepository<State,
  Id extends Identity = Identity,
  Metadata extends ReadModelMetadata<Id> = ReadModelMetadata<Id>,
  Action extends ReadModelAction<Id, Metadata> = ReadModelAction<Id, Metadata>> implements ActionRepositoryInterface<State, Id, Metadata, Action> {

  constructor(private readonly actionRepository: ActionRepositoryInterface<State, Id, Metadata, Action>,
              private readonly snapshotRepository: StoreRepository<State, Id, Metadata, Action>,
  ) {

  }

  public async append(id: Id, eventStream: ActionStream<Action>): Promise<void> {
    const model = await this.snapshotRepository.find(id) || await this.snapshotRepository.create(id);
    const store = model.getStore();
    await eventStream.pipe(tap((action: Action) => {
      store.dispatch(action);
    })).toPromise();
    await this.snapshotRepository.save(model);
    await this.actionRepository.save(model);
  }

  public create(id: Id): Promise<StoreReadModel<State, Id, Metadata, Action>> {
    return this.actionRepository.create(id);
  }

  public find(id: Id): Promise<null | StoreReadModel<State, Id, Metadata, Action>> {
    return this.snapshotRepository.find(id);
  }

  public get(id: Id): Promise<StoreReadModel<State, Id, Metadata, Action>> {
    return this.snapshotRepository.get(id);
  }

  public has(id: Id): Promise<boolean> {
    return this.snapshotRepository.has(id);
  }

  public load(id: Id): ActionStream<Action> {
    return this.actionRepository.load(id);
  }

  public loadFromPlayhead(id: Id, playhead: number): ActionStream<Action> {
    return this.actionRepository.loadFromPlayhead(id, playhead);
  }

  public async remove(id: Id): Promise<void> {
    await this.actionRepository.remove(id);
    await this.snapshotRepository.remove(id);
  }

  public async save(model: StoreReadModel<State, Id, Metadata, Action>): Promise<void> {
    const events = await model.getUncommittedActions();
    return this.append(model.getId(), events);
  }

  public findAll(): Observable<StoreReadModel<State, Id, Metadata, Action>> {
    return this.snapshotRepository.findAll();
  }

}
