import { StateReadModel } from '../Model/StateReadModel';
import { SerializerInterface } from '../../Serializer/SerializerInterface';
import { Repository } from '@triviality/eventsourcing/ReadModel/Repository';
import { BlobReadModel } from '@triviality/eventsourcing/ReadModel/BlobReadModel';
import { Playhead } from '../../ValueObject/Playhead';
import { Identity } from '@triviality/eventsourcing/ValueObject/Identity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SerializedStateData {
  playhead: Playhead;
  serialized: string;
}

export class SerializableStateRepository<State, Id extends Identity> implements Repository<StateReadModel<State, Id>, Id> {

  constructor(private readonly stateRepository: Repository<BlobReadModel<SerializedStateData>>, private readonly serializer: SerializerInterface) {

  }

  public save(model: StateReadModel<State, Id>): Promise<void> {
    const serialized = this.serializer.serialize(model.getState());
    return this.stateRepository.save(new BlobReadModel(model.getId(), {
      playhead: model.getPlayhead(),
      serialized,
    }));
  }

  public has(id: Id): Promise<boolean> {
    return this.stateRepository.has(id);
  }

  public async get(id: Id): Promise<StateReadModel<State, Id>> {
    const model = await this.stateRepository.get(id);
    return this.deSerialize(model, id);
  }

  public async find(id: Id): Promise<null | StateReadModel<State, Id>> {
    const data = await this.stateRepository.find(id);
    if (data === null) {
      return null;
    }
    return this.deSerialize(data, id);
  }

  public remove(id: Id): Promise<void> {
    return this.stateRepository.remove(id);
  }

  public findAll(): Observable<StateReadModel<State, Id>> {
    return this.stateRepository.findAll().pipe(map((data) => this.deSerialize(data, data.getId())));
  }

  private deSerialize(data: BlobReadModel<SerializedStateData>, id: Identity) {
    const payLoad = data.getPayLoad();
    const deSerialized: any = this.serializer.deserialize(payLoad.serialized);
    return new StateReadModel(id, deSerialized, payLoad.playhead) as StateReadModel<State, Id>;
  }

}
