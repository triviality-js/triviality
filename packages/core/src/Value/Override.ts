import { ServiceTag } from '../ServiceFactory';

export interface OverrideOptions<T = unknown> {
  tag: ServiceTag;
  override: (original: T) => T;
}

export class Override<T = unknown> {
  public readonly tag: ServiceTag;
  public readonly override: (original: T) => T;

  constructor({ tag, override }: OverrideOptions<T>) {
    this.tag = tag;
    this.override = override;
  }
}
