/**
 * Handles dispatched events.
 */

export interface EventListener {

}

export type EventListenerConstructor = new(...args: any[]) => EventListener;
