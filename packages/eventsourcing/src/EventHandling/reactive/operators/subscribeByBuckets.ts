import { DomainEventStream } from '../../../Domain/DomainEventStream';
import { bucketBy } from 'rxjs-etc/operators';
import { concatMap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { EventListener } from '../../EventListener';
import { handleByDecoratedHandlers } from './handleByDecoratedHandlers';
import { DomainMessage } from '../../../Domain/DomainMessage';

export const subscribeByBuckets = (listener: EventListener, bucketCount: number, hashSelector: (event: DomainMessage) => number) =>
  (events: DomainEventStream): DomainEventStream =>
    events.pipe(
      bucketBy(bucketCount, hashSelector),
      concatMap((inputs: DomainEventStream[]) =>
        merge(...inputs.map((input) =>
          input.pipe(concatMap(handleByDecoratedHandlers(listener))),
        )),
      ),
    );
