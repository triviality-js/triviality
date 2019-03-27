import { DeNormalize, Normalize } from '@triviality/serializer';
import { ValueObject, hash } from 'immutable';
import { UuidIdentity } from '@triviality/eventsourcing/ValueObject/UuidIdentity';

/**
 * This can also be used as keys for has tables.
 */
export class ImmutableUuIdIdentity extends UuidIdentity implements ValueObject {

  @DeNormalize
  protected static deNormalize(data: string) {
    return new this(data);
  }

  public hashCode(): number {
    return hash(this.toString());
  }

  @Normalize
  protected normalize(): string {
    return this.toString();
  }
}
