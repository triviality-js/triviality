import { TaggedServiceFactoryReference } from './TaggedServiceFactoryReference';
import { BaseServiceFactoryReference } from './BaseServiceFactoryReference';

/**
 * For internal service function reference.
 *
 * @example
 *    const example: FF = ({reference}) => {
 *        const myService = reference(() => 'foo string service');
 *        return {
 *          first: myService,
 *          second: myService,
 *        };
 *    };
 *
 *    // First and second are proxies of the internal service.
 *    // Reference function is an example, many internal function are pre wrapped as a
 *    // reference.
 */
export class InternalServiceFactoryReference extends BaseServiceFactoryReference {
  public readonly type = 'internal';

  private proxies: TaggedServiceFactoryReference[] = [];

  /**
   * i = The internal dependency
   * s = The actual service
   * p = The dependency in the middle
   *
   * a -> i -> s
   * b -> i -> s
   *
   * a -> i -> p -> s
   * b -> i -> p -> s
   */
  public addReferenceProxy(proxy: TaggedServiceFactoryReference) {
    this.proxies.push(proxy);
  }

  public getReferenceProxies(): TaggedServiceFactoryReference[] {
    return this.proxies;
  }

  public label() {
    const proxies = this.getReferenceProxies();
    if (proxies.length === 0) {
      return super.label();
    }
    return `${super.label()}[${proxies.map((proxy) => proxy.label()).join(', ')}]}`;
  }
}
