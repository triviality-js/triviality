// tslint:disable-next-line
import type { EventSourcedAggregateRoot } from './EventSourcedAggregateRoot';
import { DomainEvent } from '../Domain/DomainEvent';
// tslint:disable-next-line
import { getAggregateEventHandler } from './AggregateHandleEvent';

export class EventSourcedEntity<T extends EventSourcedAggregateRoot = EventSourcedAggregateRoot> {

  constructor(protected aggregateRoot: T) {
  }

  protected apply(event: DomainEvent) {
    (this.aggregateRoot as any).apply(event);
  }

  protected handle(event: DomainEvent) {
    const method = this.getHandlersName(event);
    if (!method) {
      return;
    }
    (this as any)[method](event);
  }

  protected handleRecursively(event: DomainEvent, root: T) {
    this.handle(event);
    for (const entity of this.getChildEntities()) {
      entity.handleRecursively(event, root);
    }
  }

  protected getChildEntities(): EventSourcedEntity<T>[] {
    return [];
  }

  protected getHandlersName(event: DomainEvent): string | null {
    return getAggregateEventHandler(this, event);
  }
}

export type EventSourcedEntityConstructor<T extends EventSourcedAggregateRoot = EventSourcedAggregateRoot> = new(...args: any[]) => EventSourcedEntity<T>;
