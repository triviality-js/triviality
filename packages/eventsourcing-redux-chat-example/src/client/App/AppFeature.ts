import { FF } from '@triviality/core';
import { EventsourcingReduxClientFeatureServices } from '@triviality/eventsourcing-redux/EventsourcingReduxClientFeature';
import { persistentStateEnhancer } from '@triviality/eventsourcing-redux/Redux/persistentStateEnhancer';
import { StateStorageInterface } from '@triviality/eventsourcing-redux/Redux/StateStorageInterface';
import { LoggerFeatureServices } from '@triviality/logger';
import { SerializerFeatureServices } from '@triviality/serializer';
import { singleValue, SingleValueStoreAdapter } from '@triviality/storage';
import { domStorage } from '@triviality/storage/DOM';
import { serializeValue } from '@triviality/storage/SerializableKeyValueStoreAdapter';
import { ChatReduxFeatureServices } from '../ChatReduxFeature';
import { StoredState, StoreState } from '../StoreState';
import { appReducer } from './appReducer';
import { AppStateStorage } from './AppStateStorage';
import { StoreEnhancer } from 'redux';

export interface AppFeatureServices {
  persistentStoreEnhancer: StoreEnhancer;
  valueStore: StateStorageInterface<StoreState>;
  storedStateStore: SingleValueStoreAdapter<StoredState>;
}

export interface AppFeatureDependencies extends LoggerFeatureServices, SerializerFeatureServices, ChatReduxFeatureServices, EventsourcingReduxClientFeatureServices {

}

export const AppFeature: FF<AppFeatureServices, AppFeatureDependencies> =
  ({
     logger,
     serializer,
     registers: {
       reducers,
       enhancers,
     },
   }) => {
    reducers({
      app: () => appReducer,
    });
    enhancers('persistentStoreEnhancer');
    return {
      valueStore(): StateStorageInterface<StoreState> {
        const valueStoreLogger = logger();
        return new AppStateStorage(
          this.storedStateStore(),
          valueStoreLogger,
        );
      },

      storedStateStore(): SingleValueStoreAdapter<StoredState> {
        return singleValue(
          serializeValue(
            serializer(),
            domStorage(window.localStorage),
          ),
          'chat-state',
        );
      },
      persistentStoreEnhancer(): StoreEnhancer {
        return persistentStateEnhancer(this.valueStore()) as any;
      },
    };
  };
