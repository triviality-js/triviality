import { ServiceTag, SF } from '../ServiceFactory';
import { Override, OverrideFunction } from './Override';
// tslint:disable-next-line
import { BaseServiceFactoryReference, ServiceFactoryReferenceOptions } from './BaseServiceFactoryReference';
import { AsyncServiceFunctionReferenceError } from './AsyncServiceFunctionReferenceError';

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
    this.assertServiceFunctionNotYetInvoked();
    this.serviceFactoryInvoked = true;

    const invokeOriginal: SF = () => {
      try {
        return this.factory.bind(thisReference)();
      } catch (e) {
        if (e instanceof AsyncServiceFunctionReferenceError) {
          this.serviceFactoryInvoked = false;
        }
        throw e;
      }
    };

    const overrides: OverrideFunction<unknown>[] =
      this.overrides
          .map((override) => (previous) => override.override(previous));

    this.service = overrides.reduce<SF>(
      (prev: SF, next) => () => next(prev),
      invokeOriginal,
    )();

    this.serviceDefined = true;
  }

  public label(): string {
    return `${super.label()}.${this.tag}`;
  }
}
