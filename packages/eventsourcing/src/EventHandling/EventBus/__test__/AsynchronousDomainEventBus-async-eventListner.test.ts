/* tslint:disable:max-classes-per-file */

import { UuidIdentity } from '../../../ValueObject/UuidIdentity';
import { DomainEvent } from '../../../Domain/DomainEvent';
import { AsynchronousEventBus } from '../AsynchronousEventBus';
import { HandleDomainEvent } from '../../HandleDomainEvent';
import { SimpleDomainEventStream } from '../../../Domain/SimpleDomainEventStream';
import { SubscribeAwareEventListener, EventListener } from '../../EventListener';
import { DomainMessage } from '../../../Domain/DomainMessage';
import {noop, timer} from 'rxjs';
import { hash } from 'immutable';
import { Identity } from '../../../ValueObject/Identity';
import { subscribeByBuckets } from '../../reactive/operators/subscribeByBuckets';

it('Should be able to handle value sync', async () => {
  class HasAddedNumber implements DomainEvent {
    constructor(public readonly value: number) {

    }
  }

  let delay = 100;
  jest.setTimeout(delay * 20);

  class HasAddedNumberHandler implements EventListener {
    public numbers: number[] = [];

    @HandleDomainEvent
    public async addNumber(event: HasAddedNumber) {
      delay -= 10;
      await timer(delay).toPromise();
      this.numbers.push(event.value);
    }
  }

  const handler = new HasAddedNumberHandler();

  const bus = new AsynchronousEventBus(noop);
  bus.subscribe(handler);

  function createMessage(value: number) {
    return DomainMessage.recordNow(
      UuidIdentity.create(),
      0,
      new HasAddedNumber(value),
    );
  }

  const m1 = createMessage(1);
  const m2 = createMessage(2);
  const m3 = createMessage(3);
  const m4 = createMessage(4);
  const m5 = createMessage(5);
  const m6 = createMessage(6);
  const m7 = createMessage(7);
  const m8 = createMessage(8);
  bus.publish(SimpleDomainEventStream.of([m1, m2, m3, m4, m5, m6, m7, m8]));

  await bus.untilIdle();
  expect(handler.numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

});

it('Should be able to handle value async', async () => {
  class HasAddedNumber implements DomainEvent {
    constructor(public readonly value: number) {

    }
  }

  let delay = 100;
  jest.setTimeout(delay * 20);

  class HasAddedNumberHandler implements SubscribeAwareEventListener {
    public numbers: number[] = [];

    @HandleDomainEvent
    public async addNumber(event: HasAddedNumber) {
      delay -= 10;
      await timer(delay).toPromise();
      this.numbers.push(event.value);
    }

    /**
     */
    public subscribeBy = subscribeByBuckets(this, noop, 8, (event) => hash(event.aggregateId));
  }

  const handler = new HasAddedNumberHandler();

  const bus = new AsynchronousEventBus(noop);
  bus.subscribe(handler);

  function createMessage(value: number, id?: Identity) {
    return DomainMessage.recordNow(
      id ?? UuidIdentity.create(),
      0,
      new HasAddedNumber(value),
    );
  }

  const m1 = createMessage(1);
  const m2 = createMessage(2);
  const m3 = createMessage(3);
  const m4 = createMessage(4);
  const m5 = createMessage(5);
  const m6 = createMessage(6);
  const m7 = createMessage(7);
  const m8 = createMessage(8);
  bus.publish(SimpleDomainEventStream.of([m1, m2, m3, m4, m5, m6, m7, m8]));

  await bus.untilIdle();
  expect(handler.numbers).toEqual([8, 7, 6, 5, 4, 3, 2, 1]);

});

it('Same aggregate id should still be in order', async () => {
  class HasAddedNumber implements DomainEvent {
    constructor(public readonly value: number) {

    }
  }

  jest.setTimeout(2000);

  let timeout = 200;
  class HasAddedNumberHandler implements SubscribeAwareEventListener {
    public numbers: number[] = [];

    @HandleDomainEvent
    public async addNumber(event: HasAddedNumber) {
      if (event.value < 5) {
        timeout -= 20;
        await timer(timeout).toPromise();
      }
      this.numbers.push(event.value);
    }

    public subscribeBy = subscribeByBuckets(this, noop, 8, (event) => hash(event.aggregateId));
  }

  const handler = new HasAddedNumberHandler();

  const bus = new AsynchronousEventBus(noop);
  bus.subscribe(handler);

  function createMessage(value: number, id?: Identity) {
    return DomainMessage.recordNow(
      id ?? UuidIdentity.create(),
      0,
      new HasAddedNumber(value),
    );
  }

  const m1 = createMessage(1);
  const m2 = createMessage(2);
  const m3 = createMessage(3);
  const m4 = createMessage(4);

  const m5 = createMessage(5, m1.aggregateId);
  const m6 = createMessage(6, m2.aggregateId);
  const m7 = createMessage(7, m3.aggregateId);
  const m8 = createMessage(8, m4.aggregateId);
  bus.publish(SimpleDomainEventStream.of([m1, m2, m3, m4, m5, m6, m7, m8]));

  await bus.untilIdle();
  expect(handler.numbers).toEqual([4, 8, 3, 7, 2, 6, 1, 5]);

});
