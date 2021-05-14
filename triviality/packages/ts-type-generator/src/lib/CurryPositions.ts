import {range, constant, reverse} from "lodash";

export class CurryPositions {

  constructor(public readonly length: number, public binary: number) {
  }

  public toString() {
    let s = this.binary.toString(2);

    if (s.length < this.length) {
      s  = range(0, this.length - s.length).map(constant('0')).join('') + s
    }

    return s;
  }

  /**
   * 1 - 10
   */
  public atPos(i: number) {
    if (i === 0){
      throw new Error('Should count from 1.');
    }
    return this.binary & 1 << (i - 1);
  }
}
