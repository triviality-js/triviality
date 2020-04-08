import { ServiceTag, SF } from '../ServiceFactory';

export interface OverrideOptions<T = unknown> {
  tag: ServiceTag;
  override: OverrideFunction<T>;
}

export type OverrideFunction<T> = (original: SF<T>) => T;

export class Override<T = unknown> {
  public readonly tag: ServiceTag;
  public readonly override: OverrideFunction<T>;

  constructor({ tag, override }: OverrideOptions<T>) {
    this.tag = tag;
    this.override = override;
  }
}
