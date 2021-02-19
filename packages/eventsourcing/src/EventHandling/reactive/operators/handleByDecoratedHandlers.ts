/**
 * Simple synchronous publishing of events.
 */
import { DomainMessage } from '../../../Domain/DomainMessage';
import { allHandleDomainEventMetadata, DomainEventHandlerMetadata } from '../../HandleDomainEvent';
import { IncorrectDomainEventHandlerError } from '../../Error/IncorrectDomainEventHandlerError';
import { DomainEventConstructor } from '../../../Domain/DomainEvent';
import { EventListener } from '../../EventListener';
import {HandlerMonitor, wrapMonitor} from "../../HandlerMonitorEvent";
import {ClassUtil} from "../../../ClassUtil";

export const handleByDecoratedHandlers = (eventListener: EventListener, monitor: HandlerMonitor): (event: DomainMessage) => Promise<DomainMessage> => {
  const createCallbackFunction = (metadata: DomainEventHandlerMetadata): (domainMessage: DomainMessage) => Promise<void> => {
    const callback = (eventListener as any)[metadata.functionName].bind(eventListener);

    const wrapper = wrapMonitor(monitor, ClassUtil.nameOff(eventListener), metadata)

    if (metadata.eventArgumentIndex === 0) {
      return wrapper((domainMessage: DomainMessage) => {
        return Promise.resolve(callback(domainMessage.payload, domainMessage));
      });
    }
    return wrapper((domainMessage: DomainMessage) => {
      return Promise.resolve(callback(domainMessage, domainMessage.payload));
    });
  };
  const handlers = allHandleDomainEventMetadata(eventListener);
  if (handlers.length === 0) {
    throw IncorrectDomainEventHandlerError.noHandlers(eventListener);
  }
  const map = new Map<DomainEventConstructor, ((domainMessage: DomainMessage) => Promise<void>)[]>();
  handlers.forEach((metadata) => {
    const current = map.get(metadata.event) || [];
    current.push(createCallbackFunction(metadata));
    map.set(metadata.event, current);
  });
  const findHandlers = (event: DomainMessage) => map.get((event.payload as any).constructor);
  return async (event: DomainMessage) => {
    const eventHandlers = findHandlers(event);
    if (!eventHandlers) {
      return event;
    }
    await Promise.all(eventHandlers.map(async (handler) => {
      return handler(event);
    }));
    return event;
  };
};
