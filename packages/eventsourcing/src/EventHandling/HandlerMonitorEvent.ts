import {DomainEventHandlerMetadata} from "./HandleDomainEvent";
import {DomainMessage} from "../Domain/DomainMessage";

export interface HandlerMonitorEventBase {
    handlerFunction: string;
    domainMessage: DomainMessage;
}


export interface HandlerMonitorEventStop extends HandlerMonitorEventBase {
    type: 'stop';
}

export interface HandlerMonitorEventStart extends HandlerMonitorEventBase {
    type: 'start';
}

export type HandlerMonitorEvent = HandlerMonitorEventStart | HandlerMonitorEventStop;


export const wrapMonitor = (monitor: HandlerMonitor, listerName: string, metadata: DomainEventHandlerMetadata) => (callback: (domainMessage: DomainMessage) => Promise<void>) => async (domainMessage: DomainMessage) => {
    try {
        monitor({
            handlerFunction: listerName + '.' + metadata.functionName,
            type: "start",
            domainMessage,
        });
        return await callback(domainMessage);
    } finally {
        monitor({
            handlerFunction: listerName + '.' + metadata.functionName,
            type: "stop",
            domainMessage,
        });
    }
};

export type HandlerMonitor = (event: HandlerMonitorEvent) => void;
