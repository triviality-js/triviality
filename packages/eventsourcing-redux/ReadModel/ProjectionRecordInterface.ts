import { QueryStateResponse } from '../QueryHandling/QueryStateResponse';
import { SerializableAction } from '../Redux/SerializableAction';
import { Playhead } from '../ValueObject/Playhead';

export interface ProjectionRecordInterface {
  readonly playhead: Playhead;
  setPlayhead(playhead?: Playhead): this;
  applyStateResponse(response: QueryStateResponse<this>, reducer: (state: this, action: SerializableAction) => this): this;
  mutate(playhead: number | undefined, mutator: (self: this) => this): this;
}
