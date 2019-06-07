import { Record } from 'immutable';
import { QueryStateResponse } from '../QueryHandling/QueryStateResponse';
import { SerializableAction } from '../Redux/SerializableAction';
import { INITIAL_PLAYHEAD, Playhead } from '../ValueObject/Playhead';
import { PlayheadError } from './Error/PlayheadError';
import { ProjectionRecordInterface } from './ProjectionRecordInterface';

/**
 * Make all properties in T null able
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export function projectionRecord<T, DefaultProps = Nullable<T>>(defaultState: DefaultProps, name: string, initialPlayhead: Playhead = INITIAL_PLAYHEAD) {
  type WithPlayhead = { playhead: Playhead } & T;
  const Factory: any = Record<WithPlayhead>({ playhead: initialPlayhead, ...(defaultState as any) }, name);
  return class PlayheadRecord extends Factory {
    public setPlayhead(playhead?: Playhead): this {
      if (this.playhead + 1 !== playhead) {
        throw PlayheadError.doesNotMatch(this.playhead, playhead);
      }
      return this.set('playhead', playhead);
    }
    public mutate(playhead: number | undefined, mutator: (self: this) => this): this {
      const newState = mutator(this);
      if (newState !== this) {
        return newState.setPlayhead(playhead);
      }
      return this;
    }

    public applyStateResponse(response: QueryStateResponse<this>, reducer: (state: this, action: SerializableAction) => this): this {
      return response.apply(this, reducer);
    }

  } as any as new (defaultProps?: DefaultProps) => (ProjectionRecordInterface & Record<WithPlayhead> & WithPlayhead);
}
