import { DomainEventStream } from '../Domain/DomainEventStream';
import { EventListener } from './EventListener';
import { concatMap, tap } from 'rxjs/operators';
import { merge, of } from 'rxjs';
import { filterByDomainEventConstructor } from './reactive/operators/filterByDomainEventConstructor';
import { flatten } from 'lodash';
import { DomainMessage } from '../Domain/DomainMessage';
import { eventListenersDomainEvents, subscribeByOfEventListener } from './index';
import { LoggerInterface, PrefixLogger, NullLogger } from '@triviality/logger';
import { ClassUtil } from '../ClassUtil';
import { splitBy } from 'rxjs-etc/operators';
import {HandlerMonitor} from "./HandlerMonitorEvent";

/**
 * Combine event listeners.
 */
export class EventListenerCollection implements EventListener {

  constructor(protected listeners: EventListener[], protected monitor: HandlerMonitor, private logger: LoggerInterface = new NullLogger()) {

  }

  public getListeners(): EventListener[] {
    return this.listeners;
  }

  public listenTo = () => {
    return flatten(this.listeners.map((lister) => eventListenersDomainEvents(lister)));
  };

  public subscribeBy = (events: DomainEventStream): DomainEventStream => {
    const formatLogMessage = (text: string, message: DomainMessage) => {
      if (this.logger instanceof NullLogger) {
        return null;
      }
      return `${message.aggregateId} - ${message.playhead}:${ClassUtil.nameOff(message.payload)}:${text}`;
    };
    /**
     * Handle by all listeners.
     */
    const operators: ((input: DomainEventStream) => DomainEventStream)[] = this.listeners.map((listener) => {
      const ll = new PrefixLogger(this.logger, `handle by ${ClassUtil.nameOff(listener)}:`)
      return (input) => input.pipe(
        filterByDomainEventConstructor(eventListenersDomainEvents(listener)),
        tap((event) => {
          ll.info(formatLogMessage('start', event));
        }),
        subscribeByOfEventListener(listener, this.monitor),
        tap((event) => {
          ll.info(formatLogMessage('end', event));
        }),
      );
    });
    const listenTo = this.listenTo();
    return events.pipe(
      tap((message) => {
        this.logger.info(formatLogMessage('start', message));
      }),
      concatMap((message) => {
        return of(message);
      }),
      splitBy((message: DomainMessage) => listenTo.includes((message.payload as any).constructor)),
      concatMap(([filtered, rest]) => {
        const shared = filtered.pipe(tap((message) => {
          this.logger.info(formatLogMessage('accepted', message));
        }));
        return merge(
          merge(
            ...operators.map((operator) => operator(shared))
          ),
          rest.pipe(tap((message) => {
            this.logger.info(formatLogMessage('ignored', message));
          }))
        );
      }),
      tap((message) => {
        this.logger.info(formatLogMessage('end', message));
      }),
    );
  };
}
