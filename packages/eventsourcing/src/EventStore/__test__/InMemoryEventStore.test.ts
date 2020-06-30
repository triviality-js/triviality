import 'jest';
import { PlayheadError } from '../../Domain/Error/PlayheadError';
import { ScalarIdentity } from '../../ValueObject/ScalarIdentity';
import { InMemoryEventStore } from '../InMemoryEventStore';
import { EventStreamNotFoundError } from '../Error/EventStreamNotFoundError';
import { SimpleDomainEventStream } from '../../Domain/SimpleDomainEventStream';
import { DomainMessage } from '../../Domain/DomainMessage';
import { map, take, toArray } from 'rxjs/operators';
import { Mutex } from 'async-mutex';
import { timer } from 'rxjs';
import v4 from 'uuid/v4';

class DomainEvent {

}

describe('InMemoryEventStore', () => {
  const date = new Date();
  date.setTime(1535183762);

  it('Throws an exception loading an unknown event stream', async () => {
    const repository = new InMemoryEventStore();
    const id = new ScalarIdentity('38459347598437');
    const eventStreamNotFoundException = new EventStreamNotFoundError(
      'EventStream not found for aggregate with id 38459347598437');
    return expect(() => {
      repository.load(id);
    }).toThrowError(eventStreamNotFoundException as any);
  });

  it('Can append domain event', async () => {
    const repository = new InMemoryEventStore();
    const id = new ScalarIdentity('38459347598437');
    const event = new DomainMessage(id, 0, new DomainEvent(), date);
    const eventstream = SimpleDomainEventStream.of([event]);
    await repository.append(id, eventstream);
    expect(await repository.load(id).pipe(toArray()).toPromise()).toEqual([event]);
  });

  it('Can append multiple domain events at once', async () => {
    const repository = new InMemoryEventStore();
    const id = new ScalarIdentity('38459347598437');
    const event1 = new DomainMessage(id, 0, new DomainEvent(), date);
    const event2 = new DomainMessage(id, 1, new DomainEvent(), date);
    const eventStream = SimpleDomainEventStream.of([event1, event2]);
    await repository.append(id, eventStream);
    expect(await repository.load(id).pipe(toArray()).toPromise()).toEqual([event1, event2]);
  });

  it('Can append multiple domain events streams', async () => {
    const repository = new InMemoryEventStore();
    const id = new ScalarIdentity('38459347598437');
    const event1 = new DomainMessage(id, 0, new DomainEvent(), date);
    const event2 = new DomainMessage(id, 1, new DomainEvent(), date);
    const eventstream1 = SimpleDomainEventStream.of([event1, event2]);
    await repository.append(id, eventstream1);
    const event3 = new DomainMessage(id, 2, new DomainEvent(), date);
    const event4 = new DomainMessage(id, 3, new DomainEvent(), date);
    const eventstream2 = SimpleDomainEventStream.of([event3, event4]);
    await repository.append(id, eventstream2);
    expect(await repository.load(id).pipe(toArray()).toPromise()).toEqual([event1, event2, event3, event4]);
  });

  it('Can have multiple different events streams', async () => {
    const repository = new InMemoryEventStore();
    const aggregate1Id = new ScalarIdentity('aggregate1 ID');
    const event1Aggregate1 = new DomainMessage(aggregate1Id, 0, new DomainEvent(), date);
    const event2Aggregate1 = new DomainMessage(aggregate1Id, 1, new DomainEvent(), date);
    const aggregate1Stream = SimpleDomainEventStream.of([event1Aggregate1, event2Aggregate1]);
    await repository.append(aggregate1Id, aggregate1Stream);

    const aggregate2Id = new ScalarIdentity('aggregate2 ID');
    const event1Aggregate2 = new DomainMessage(aggregate2Id, 0, new DomainEvent(), date);
    const event2Aggregate2 = new DomainMessage(aggregate2Id, 1, new DomainEvent(), date);
    const aggregate2Stream = SimpleDomainEventStream.of([event1Aggregate2, event2Aggregate2]);
    await repository.append(aggregate2Id, aggregate2Stream);

    expect(repository).toMatchSnapshot('InMemoryEventStore');
    expect(await repository.load(aggregate1Id).pipe(toArray()).toPromise()).toEqual(
      [event1Aggregate1, event2Aggregate1]);
    expect(await repository.load(aggregate2Id).pipe(toArray()).toPromise()).toEqual(
      [event1Aggregate2, event2Aggregate2]);
  });

  it('Throws an exception when playhead is not correct', async () => {
    const repository = new InMemoryEventStore();
    const id = new ScalarIdentity('38459347598437');
    const event1 = new DomainMessage(id, 0, new DomainEvent(), date);
    const event2 = new DomainMessage(id, 2, new DomainEvent(), date);
    const event3 = new DomainMessage(id, 1, new DomainEvent(), date);
    const eventStream = SimpleDomainEventStream.of([event1, event2, event3]);
    const playheadError = PlayheadError.create(1, 2);
    await expect(repository.append(id, eventStream)).rejects.toThrowError(playheadError as any);
  });

  it('Can load all', async () => {
    const store = new InMemoryEventStore();
    const id1 = new ScalarIdentity('1');
    const event1 = new DomainMessage(id1, 0, new DomainEvent(), date);
    const eventStream1 = SimpleDomainEventStream.of([event1]);
    await store.append(id1, eventStream1);

    const id2 = new ScalarIdentity('2');
    const event2 = new DomainMessage(id2, 0, new DomainEvent(), date);
    const eventStream2 = SimpleDomainEventStream.of([event2]);
    await store.append(id2, eventStream2);

    const all = store.loadAll();
    expect(await all.pipe(toArray()).toPromise()).toEqual([event1, event2]);
  });

  it('Can load from certain playhead', async () => {
    const store = new InMemoryEventStore();
    const id = new ScalarIdentity('38459347598437');
    const event1 = new DomainMessage(id, 0, new DomainEvent(), date);
    const event2 = new DomainMessage(id, 1, new DomainEvent(), date);
    const event3 = new DomainMessage(id, 2, new DomainEvent(), date);
    const event4 = new DomainMessage(id, 3, new DomainEvent(), date);
    const eventStream = SimpleDomainEventStream.of([event1, event2, event3, event4]);

    await store.append(id, eventStream);
    const fromPlayhead = store.loadFromPlayhead(id, 2);
    expect(await fromPlayhead.pipe(toArray()).toPromise()).toEqual([event3, event4]);
  });

  it('Knows it has an event stream', async () => {
    const store = new InMemoryEventStore();
    const id = new ScalarIdentity('38459347598437');
    const event1 = new DomainMessage(id, 0, new DomainEvent(), date);
    const eventStream = SimpleDomainEventStream.of([event1]);
    await store.append(id, eventStream);
    expect(await store.has(id)).toBeTruthy();
    expect(await store.has(new ScalarIdentity('does not exists'))).toBeFalsy();
  });

  it('Can create from array', async () => {
    const id = new ScalarIdentity('38459347598437');
    const event1 = new DomainMessage(id, 0, new DomainEvent(), date);
    const event2 = new DomainMessage(id, 1, new DomainEvent(), date);
    const event3 = new DomainMessage(id, 2, new DomainEvent(), date);
    const event4 = new DomainMessage(id, 3, new DomainEvent(), date);

    const store = InMemoryEventStore.fromArray([event1, event2, event3, event4]);

    expect(await store.load(id).pipe(toArray()).toPromise()).toEqual([event1, event2, event3, event4]);
  });

  it('Should wait for mutex to be finished', async () => {
    const now = new Date();
    const store = new InMemoryEventStore(() => new Mutex());
    const id = 'c2950d0e-71e6-4bf3-8389-8a98981fb67c';
    const stream1 = timer(50).pipe(take(1), map(() => new DomainMessage(id, 0, { foo: 'foo' }, now, {})));
    const stream2 = timer(100).pipe(take(1), map(() => new DomainMessage(id, 1, { bar: 'bar' }, now, {})));

    const pendingStore = store.append(id, stream1);

    // Should wait for this to complete, becuase we are in pending store.
    const load = store.load(id).pipe(toArray()).toPromise();
    const has = store.has(id);
    const hasNot = store.has(v4());
    const append = store.append(id, stream2);
    await pendingStore;

    expect(await load).toEqual([new DomainMessage(id, 0, { foo: 'foo' }, now, {})]);
    expect(await has).toEqual(true);
    expect(await hasNot).toEqual(false);

    await append;

    expect(await store.load(id).pipe(toArray()).toPromise()).toEqual([
      new DomainMessage(id, 0, { foo: 'foo' }, now, {}),
      new DomainMessage(id, 1, { bar: 'bar' }, now, {}),
    ]);

  });

});
