import { StoreReadModel } from '../Model/StoreReadModel';
import { StoreFactory } from '../../Redux/Store/StoreFactory';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { ReadModelAction, ReadModelMetadata } from '../ReadModelAction';
import { tap, toArray } from 'rxjs/operators';
import { NotFoundError } from '../Error/NotFoundError';
import { Store } from 'redux';
import { INITIAL_PLAYHEAD, Playhead } from '../../ValueObject/Playhead';
import { ActionRepositoryInterface } from '../ActionRepositoryInterface';
import { ActionStream } from '../ActionStream';
import { SimpleActionStream } from '../SimpleActionStream';
import { Observable } from 'rxjs';
import { Map } from 'immutable';

export class InMemoryActionRepository<State,
  Id extends Identity = Identity,
  Metadata extends ReadModelMetadata<Id> = ReadModelMetadata<Id>,
  Action extends ReadModelAction<Id, Metadata> = ReadModelAction<Id, Metadata>> implements ActionRepositoryInterface<State, Id, Metadata, Action> {

  private actions: Map<Id, Action[]> = Map();

  constructor(private readonly storeFactory: StoreFactory<State, Action>) {

  }

  public async create(id: Id): Promise<StoreReadModel<State, Id, Metadata, Action>> {
    return new StoreReadModel<State, Id, Metadata, Action>(id, this.storeFactory.create(), INITIAL_PLAYHEAD);
  }

  public async save(model: StoreReadModel<State, Id, Metadata, Action>): Promise<void> {
    const actions: Action[] = await model.getUncommittedActions().pipe(toArray()).toPromise();
    const previousActions: Action[] = this.actions.get(model.getId(), []);
    this.actions = this.actions.set(model.getId(), previousActions.concat(actions));
  }

  public async has(id: Id): Promise<boolean> {
    return this.actions.has(id);
  }

  public async get(id: Id): Promise<StoreReadModel<State, Id, Metadata, Action>> {
    const actions: Action[] | undefined = this.actions.get(id);
    if (!actions) {
      throw NotFoundError.storeNotFound(id);
    }
    const store: Store<State, Action> = this.storeFactory.create();
    actions.forEach((action: Action) => {
      store.dispatch(action);
    });
    const lastPlayhead: Playhead = actions.length === 0 ? 0 : actions[actions.length - 1].metadata.playhead as Playhead;
    return new StoreReadModel<State, Id, Metadata, Action>(id, store, lastPlayhead);
  }

  public async find(id: Id): Promise<null | StoreReadModel<State, Id, Metadata, Action>> {
    if (!this.has(id)) {
      return null;
    }
    return this.get(id);
  }

  public async remove(id: Id): Promise<void> {
    this.actions = this.actions.remove(id);
  }

  public async append(id: Id, eventStream: ActionStream<Action>): Promise<void> {
    const actions: Action[] = this.actions.get(id, []);
    await eventStream.pipe(tap((action) => actions.push(action))).toPromise();
  }

  public load(id: Id): ActionStream<Action> {
    const actions: Action[] | undefined = this.actions.get(id);
    if (!actions) {
      throw NotFoundError.storeNotFound(id);
    }
    return SimpleActionStream.of(actions);
  }

  public loadFromPlayhead(id: Id, playhead: number): ActionStream<Action> {
    const actions: Action[] | undefined = this.actions.get(id);
    if (!actions) {
      throw NotFoundError.storeNotFound(id);
    }
    return SimpleActionStream.of(actions.slice(playhead));
  }

  public findAll(): Observable<StoreReadModel<State, Id, Metadata, Action>> {
    return new Observable<StoreReadModel<State, Id, Metadata, Action>>((observer) => {
      const all = async () => {
        for (const id of this.actions.keySeq().toArray()) {
          if (observer.closed) {
            return;
          }
          observer.next(await this.get(id));
        }
      };
      all()
        .then(() => observer.complete())
        .catch((error) => observer.error(error));
    });
  }

}
