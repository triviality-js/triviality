/**
 * Simple synchronous publishing of events.
 */
import { allHandleDomainEventMetadata } from '../../HandleDomainEvent';
import { IncorrectDomainEventHandlerError } from '../../Error/IncorrectDomainEventHandlerError';
import { DomainEventConstructor } from '../../../Domain/DomainEvent';
import { EventListener } from '../../EventListener';

export const filterByDecoratedHandlers = (eventListener: EventListener) => {
  const handlers = allHandleDomainEventMetadata(eventListener).map(({ event }) => event);
  if (handlers.length === 0) {
    throw IncorrectDomainEventHandlerError.noHandlers(eventListener);
  }
  return (): DomainEventConstructor[] => handlers;
};
