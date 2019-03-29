import { EntityMetadata } from '@triviality/eventsourcing-redux/Redux/EntityMetadata';
import { ReduxFeature } from '@triviality/redux/ReduxFeature';
import { Action } from 'redux';
import { StoreState } from './StoreState';

export class ChatReduxFeature extends ReduxFeature<StoreState, Action<any> & { metadata: EntityMetadata }> {

}
