import { Record } from 'immutable';
import { Playhead } from 'eventsourcing-redux-bridge/ValueObject/Playhead';

/**
 * Make all properties in T null able
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export interface WithPlayheadInterface {
  readonly playhead: Playhead;
  setPlayhead(playhead?: Playhead): this;
}

export class PlayheadError extends Error {

  public static doesNotMatch(current: Playhead, next?: Playhead) {
    return new this(`Playhead ${current} + 1 != ${next} does not match new playhead`);
  }

}

export function RecordWithPlayhead<T, DefaultProps = Nullable<T>>(defaultState: DefaultProps, name: string, playhead: Playhead = 0) {
  type WithPlayhead = { playhead: Playhead } & T;
  const Factory: any = Record<WithPlayhead>({ playhead, ...(defaultState as any) }, name);
  return class BaseClass extends Factory {
    public setPlayhead(playhead?: Playhead): this {
      if (this.playhead + 1 !== playhead) {
        throw PlayheadError.doesNotMatch(this.playhead, playhead);
      }
      return this.set('playhead', playhead);
    }
  } as any as new (defaultProps?: DefaultProps) => (WithPlayheadInterface & Record<WithPlayhead> & WithPlayhead);
}
