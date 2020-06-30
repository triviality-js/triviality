import { concatMap, filter, toArray } from 'rxjs/operators';
import { MutexInterface } from 'async-mutex';
import { from } from 'rxjs';
import { ValueMutex } from '../ValueMutex';
import { WrongAggregateIdError } from './Error/WrongAggregateIdError';
import { Mutex } from 'async-mutex';
import { EventStore } from './EventStore';
import { EventStreamNotFoundError } from './Error/EventStreamNotFoundError';
import { DomainEventStream } from '../Domain/DomainEventStream';
import { Identity } from '../ValueObject/Identity';
import { DomainMessage } from '../Domain/DomainMessage';
import { PlayheadError } from '../Domain/Error/PlayheadError';

export class InMemoryEventStore<Id extends Identity = Identity>
  implements EventStore<Id> {
  public static fromArray<Id extends Identity = Identity>(events: DomainMessage[], mutexFactory: () => MutexInterface = () => new Mutex()) {
    const instance = new this<Id>(mutexFactory);
    instance.events = new ValueMutex([...events], mutexFactory());
    const mapped = new Map<Id, DomainMessage[]>();
    for (const event of events) {
      const list = mapped.get(event.aggregateId as Id) || [];
      list.push(event);
      mapped.set(event.aggregateId as Id, list);
    }
    mapped.forEach((value, key) => {
      instance.eventsMap.set(key, new ValueMutex(value, mutexFactory()));
    });
    return instance;
  }

  protected readonly eventsMap: Map<Id, ValueMutex<DomainMessage[]>> = new Map();
  protected events = new ValueMutex<DomainMessage[]>([], this.mutexFactory());

  constructor(private mutexFactory: () => MutexInterface = () => new Mutex()) {
  }

  public async has(id: Id): Promise<boolean> {
    const map = this.eventsMap.get(id);
    if (!map) {
      return false;
    }
    return map.runExclusive((value) => {
      return value.length !== 0;
    });
  }

  public load(id: Id): DomainEventStream {
    const map = this.eventsMap.get(id);
    if (!map) {
      throw EventStreamNotFoundError.streamNotFound(id);
    }
    return from(map.runExclusive((events) => {
      if (events.length !== 0) {
        return events;
      }
      throw EventStreamNotFoundError.streamNotFound(id);
    })).pipe(concatMap((events) => events));
  }

  public loadAll(): DomainEventStream {
    return from(this.events.runExclusive((events) => events)).pipe(concatMap((events) => events));
  }

  public loadFromPlayhead(id: Id, playhead: number): DomainEventStream {
    return this.load(id).pipe(filter((message: DomainMessage) => playhead <= message.playhead));
  }

  /**
   * This save the hole stream or nothing at all.
   */
  public async append(id: Id, eventStream: DomainEventStream): Promise<void> {
    if (!this.eventsMap.has(id)) {
      this.eventsMap.set(id, new ValueMutex<DomainMessage[]>([], this.mutexFactory()));
    }
    await this.eventsMap.get(id)!.runExclusive(async (target) => {
      await this.events.runExclusive(async (all) => {
        let lastPlayhead = this.lastPlayheadOf(target);
        const events = await eventStream.pipe(
          concatMap(async (event: DomainMessage) => {
            lastPlayhead += 1;
            if (event.aggregateId !== id) {
              throw WrongAggregateIdError.create(event.aggregateId, id);
            }
            if (event.playhead !== lastPlayhead) {
              throw PlayheadError.create(lastPlayhead, event.playhead);
            }
            return event;
          }),
          toArray(),
        ).toPromise();
        // Add if everything is ok.
        target.push(...events);
        all.push(...events);
        return events;
      });
    });
  }

  private lastPlayheadOf(events: DomainMessage[]): number {
    return events.length !== 0 ? events[events.length - 1].playhead : -1;
  }
}
