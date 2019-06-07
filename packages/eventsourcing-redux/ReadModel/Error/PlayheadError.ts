import { Playhead } from '../../ValueObject/Playhead';

export class PlayheadError extends Error {

  public static doesNotMatch(current: Playhead, next?: Playhead) {
    return new this(`Playhead ${current} + 1 != ${next} does not match new playhead`);
  }

}
