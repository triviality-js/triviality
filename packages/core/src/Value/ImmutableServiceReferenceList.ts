import { ServiceFactoryReference } from './ServiceFactoryReference';
import { ServiceTag, SF } from '../ServiceFactory';
// tslint:disable-next-line
import { TaggedServiceFactoryReference } from './TaggedServiceFactoryReference';
import { fromPairs } from 'ramda';

export class ImmutableServiceReferenceList {
  constructor(private readonly references: ServiceFactoryReference[] = []) {
  }

  /**
   * This dependency is depended on the other dependency.
   */
  public add(dependency: ServiceFactoryReference): ImmutableServiceReferenceList {
    if (this.has(dependency)) {
      return this;
    }
    return new ImmutableServiceReferenceList([...this.references, dependency]);
  }

  public getService(tag: ServiceTag): TaggedServiceFactoryReference {
    const service = this.references.find((dep) => {
      return dep.type === 'tagged' && dep.tag === tag;
    });
    if (!service || service.type !== 'tagged') {
      throw new Error(`Service with ${tag} not found`);
    }
    return service;
  }

  public taggedPairs(): [ServiceTag, TaggedServiceFactoryReference][] {
    const filtered = this.references.filter((dep) => {
      return dep.type === 'tagged';
    }) as any;
    return filtered.map((dependency: any) => [dependency.tag, dependency]);
  }

  public async(): ImmutableServiceReferenceList {
    return this.filter((dep) => {
      return dep.type === 'async';
    });
  }

  public notASync(): ImmutableServiceReferenceList {
    return this.filter((dep) => {
      return dep.type !== 'async';
    });
  }

  public filter(accept: (reference: ServiceFactoryReference) => boolean): ImmutableServiceReferenceList {
    const filtered = this.references.filter(accept);
    return new ImmutableServiceReferenceList(filtered);
  }

  public serviceFactoryObject(): Record<ServiceTag, SF> {
    const pairs: any = this.taggedPairs().map(([tag, reference]) => [tag, reference.getProxy()]);
    return fromPairs(pairs);
  }

  public has(needle: ServiceFactoryReference): boolean {
    return !!this.references.find((ref) => ref.getDependencies().has(needle));
  }

  public hasTagged(needle: ServiceTag): boolean {
    return this.taggedPairs().filter(([tag]) => {
      return needle === tag;
    }).length !== 0;
  }

  public toArray(): ServiceFactoryReference[] {
    return [...this.references];
  }

  public remove(reference: ServiceFactoryReference) {
    return this.filter((ref) => ref !== reference);
  }

  public last() {
    return this.references[this.references.length - 1];
  }

  public forEach(iterator: (dependency: ServiceFactoryReference) => void) {
    return this.references.forEach(iterator);
  }

  public isEmpty() {
    return this.references.length === 0;
  }

  public isNotEmpty() {
    return this.references.length !== 0;
  }

  public count() {
    return this.references.length;
  }
}
