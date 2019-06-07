import { Container, Feature, OptionalRegistries } from '@triviality/core';
import { EventsourcingReduxClientFeature } from '@triviality/eventsourcing-redux/EventsourcingReduxClientFeature';
import { persistentStateEnhancer } from '@triviality/eventsourcing-redux/Redux/persistentStateEnhancer';
import { StateStorageInterface } from '@triviality/eventsourcing-redux/Redux/StateStorageInterface';
import { LoggerFeature } from '@triviality/logger';
import { SerializerFeature } from '@triviality/serializer';
import { singleValue } from '@triviality/storage';
import { domStorage } from '@triviality/storage/DOM';
import { serializeValue } from '@triviality/storage/SerializableKeyValueStoreAdapter';
import { ChatReduxFeature } from '../ChatReduxFeature';
import { StoreState } from '../StoreState';
import { appReducer } from './appReducer';
import { AppStateStorage } from './AppStateStorage';

export class AppFeature implements Feature {

  constructor(private container: Container<LoggerFeature, SerializerFeature, ChatReduxFeature>) {
  }

  public registries(): OptionalRegistries<ChatReduxFeature> {
    return {
      reducers: () => {
        return {
          app: appReducer,
        };
      },
      enhancers: () => {
        return [this.persistentStoreEnhancer()];
      },
    };
  }

  public serviceOverrides(container: Readonly<Container<EventsourcingReduxClientFeature>>): Partial<Container<EventsourcingReduxClientFeature>> {
    return {
      defaultGatewayOption: () => {
        const baseOptions = container.defaultGatewayOption();
        return {
          ...baseOptions,
          gate: `http://localhost:3000${baseOptions.gate}`,
        };
      },
    };
  }

  public valueStore(): StateStorageInterface<StoreState> {
    const logger = this.container.logger();
    return new AppStateStorage(
      this.storedStateStore(),
      logger,
    );
  }

  public storedStateStore() {
    return singleValue(
      serializeValue(
        this.container.serializer(),
        domStorage(window.localStorage),
      ),
      'chat-state',
    );
  }

  public persistentStoreEnhancer() {
    return persistentStateEnhancer(this.valueStore());
  }
}
