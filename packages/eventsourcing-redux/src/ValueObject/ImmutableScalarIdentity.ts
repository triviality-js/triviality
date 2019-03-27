import { DeNormalize, Normalize } from '@triviality/serializer';
import { ValueObject, hash } from 'immutable';
import { ScalarIdentity } from '@triviality/eventsourcing/ValueObject/ScalarIdentity';

/**
 * This can also be used as keys for has tables or be serialized.
 */
export class ImmutableScalarIdentity<T> extends ScalarIdentity<T> implements ValueObject {

  @DeNormalize
  protected static deNormalize(data: any) {
    return new this(data);
  }

  public hashCode(): number {
    return hash(this.toString());
  }

  @Normalize
  protected normalize(): T {
    return this.getValue();
  }

}
