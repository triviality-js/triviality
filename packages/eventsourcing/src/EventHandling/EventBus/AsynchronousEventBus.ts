/**
 * Simple synchronous publishing of events.
 */
import { EventListener } from '../EventListener';
import { DomainEventStream } from '../../Domain/DomainEventStream';
import { DomainMessage } from '../../Domain/DomainMessage';
import { Subject } from 'rxjs';
import { IdleAwareEventBus } from '../IdleAwareEventBus';
import { finalize, ignoreElements, tap } from 'rxjs/operators';
import { EventListenerCollection } from '../EventListenerCollection';
import { subscribeByOfEventListener } from '../index';

export class AsynchronousEventBus implements IdleAwareEventBus {
  private queue: Subject<DomainMessage> | null = null;
  /**
   * Messages that are handled by the queue.
   */
  private handled: Subject<DomainMessage> | null = null;
  /**
   * Keep track of streams added to the queue.
   */
  private pendingStreams = 0;
  /**
   */
  private pendingMessages = new Set<DomainMessage>();
  /**
   * The listeners combined inside a ASynchronousEventListener.
   */
  private listener: EventListenerCollection = new EventListenerCollection([]);

  constructor(private errorHandler?: (error: any) => void) {

  }

  public async untilIdle(): Promise<void> {
    if (this.queue === null) {
      return;
    }
    return this.queue.pipe(ignoreElements()).toPromise();
  }

  /**
   * @param domainMessages
   */
  public async publishSync(stream: DomainEventStream): Promise<void> {
    return new Promise((accept, reject) => {
      /**
       * All messages we are waiting for.
       */
      const pending = new Set<DomainMessage>();
      /**
       * When this stream has completed.
       */
      let completed = false;
      const { handled } = this.getOrCreateQueue();
      const errorOrComplete = (error?: unknown) => {
        if (error) {
          reject(error);
        }
        if (completed && pending.size === 0) {
          accept();
          subscription.unsubscribe();
        }
        this.checkToCloseQueue();
      };
      // We are subscribing on the queue for the pending messages.
      const subscription = handled.subscribe({
        next: (message) => {
          pending.delete(message);
          errorOrComplete();
        },
        error: errorOrComplete,
        complete: errorOrComplete,
      });
      this.publish(stream
        .pipe(
          // filterByDomainEventConstructor(eventListenersDomainEvents(this.listener)),
          tap((message) => {
            pending.add(message);
          }),
          finalize(() => {
            completed = true;
            errorOrComplete();
          }),
        ));
    });
  }

  public subscribe(eventListener: EventListener): void {
    this.listener = new EventListenerCollection([...this.listener.getListeners(), eventListener]);
  }

  public publish(stream: DomainEventStream): void {
    const { queue, handled } = this.getOrCreateQueue();
    this.pendingStreams += 1;
    stream.subscribe({
      next: queue.next.bind(queue),
      complete: () => {
        this.pendingStreams -= 1;
        this.checkToCloseQueue();
      },
      error: (e) => {
        queue.error(e);
        handled.error(e);
        this.cleanup();
      },
    });
  }

  private getOrCreateQueue(): { queue: Subject<DomainMessage>, handled: Subject<DomainMessage> } {
    if (this.queue && this.handled) {
      return { handled: this.handled, queue: this.queue };
    }

    const queue = new Subject<DomainMessage>();
    const handled = new Subject<DomainMessage>();
    handled.subscribe({
      next: (message) => {
        this.pendingMessages.delete(message);
        this.checkToCloseQueue();
      },
    });
    queue.pipe(
      tap((message) => this.pendingMessages.add(message)),
      subscribeByOfEventListener(this.listener),
      tap((event) => handled.next(event)),
    ).subscribe({
      error: (e) => {
        queue.error(e);
        handled.error(e);
        this.cleanup();
        if (this.errorHandler) {
          this.errorHandler(e);
        }
      },
    });
    this.handled = handled;
    this.queue = queue;
    return { handled: this.handled, queue: this.queue };
  }

  private checkToCloseQueue = () => {
    const queue = this.queue;
    const handled = this.handled;
    if (queue === null || handled === null) {
      return;
    }
    // Do we still streams to be send on the queue?
    if (this.pendingStreams !== 0) {
      return;
    }
    // Do we still pending messages on the queue?
    if (this.pendingMessages.size) {
      return;
    }
    this.cleanup();
    handled.complete();
    queue.complete();
  };

  private cleanup() {
    this.pendingMessages.clear();
    this.pendingMessages.clear();
    this.pendingStreams = 0;
    this.queue = null;
    this.handled = null;
  }
}
