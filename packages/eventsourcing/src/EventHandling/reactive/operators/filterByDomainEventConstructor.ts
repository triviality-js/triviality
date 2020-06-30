/**
 * Simple synchronous publishing of events.
 */
import { DomainEventConstructor } from '../../../Domain/DomainEvent';
import { DomainEventStream } from '../../../Domain/DomainEventStream';
import { filter } from 'rxjs/operators';

export const filterByDomainEventConstructor = (events: DomainEventConstructor[]) => {
  return (input: DomainEventStream) => input.pipe(filter((event) => {
    return events.includes((event.payload as any).constructor);
  }));
};
