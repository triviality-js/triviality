import { ServiceTag, SF } from '../ServiceFactory';
import { Override } from './Override';
// tslint:disable-next-line
import { BaseServiceFactoryReference, ServiceFactoryReferenceOptions } from './BaseServiceFactoryReference';

interface TaggedServiceFactoryReferenceOptions extends ServiceFactoryReferenceOptions {
  readonly tag: ServiceTag;
}

export class TaggedServiceFactoryReference extends BaseServiceFactoryReference {
  public readonly type = 'tagged';
  public readonly tag: ServiceTag;
  public readonly overrides: Override[] = [];

  constructor(options: TaggedServiceFactoryReferenceOptions) {
    super(options);
    this.tag = options.tag;
  }

  public override(override: Override) {
    this.overrides.push(override);
  }

  public callServiceFactory(thisReference: Record<ServiceTag, SF>) {
    super.callServiceFactory(thisReference);
    this.service = this.overrides.reduce(
      (service, override) => override.override.call(thisReference, service), this.service);
  }

  public label(): string {
    return `${super.label()}.${this.tag}`;
  }
}
