import {
  EventsourcingReduxClientFeature,
  EventsourcingReduxClientFeatureDependencies,
  EventsourcingReduxClientFeatureServices,
} from '@triviality/eventsourcing-redux/EventsourcingReduxClientFeature';
import { StoreActions, StoreState } from './StoreState';
import { FF } from '@triviality/core';
import { ReduxFeature, ReduxFeatureServices } from '@triviality/redux';

export interface ChatReduxFeatureServices extends ReduxFeatureServices<StoreState, StoreActions> {

}

export const ChatReduxFeature: FF<ChatReduxFeatureServices> = (context) => {
  return ReduxFeature()(context);
};

export interface ChatEventsourcingReduxFeatureServices extends EventsourcingReduxClientFeatureServices {

}

export interface ChatEventsourcingReduxFeatureDependencies extends EventsourcingReduxClientFeatureDependencies<StoreState, StoreActions> {

}

export const ChatEventsourcingReduxFeature: FF<ChatEventsourcingReduxFeatureServices, ChatEventsourcingReduxFeatureDependencies> = (context) => {
  return EventsourcingReduxClientFeature<StoreState>()(context);
};
