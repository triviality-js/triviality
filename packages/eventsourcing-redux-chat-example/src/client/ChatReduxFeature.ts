import { EventsourcingReduxClientFeature } from '@triviality/eventsourcing-redux/EventsourcingReduxClientFeature';
import { EntityMetadata } from '@triviality/eventsourcing-redux/Redux/EntityMetadata';
import { ReduxFeature } from '@triviality/redux/ReduxFeature';
import { Action } from 'redux';
import { StoreState } from './StoreState';

export class ChatReduxFeature extends ReduxFeature<StoreState, Action<any> & { metadata: EntityMetadata }> {

}

export class ChatEventsourcingReduxFeature extends EventsourcingReduxClientFeature<StoreState, Action<any> & { metadata: EntityMetadata }> {

}
