import { Container, Feature, OptionalContainer } from '@triviality/core';
import { EventsourcingReduxServerFeature } from '@triviality/eventsourcing-redux/EventsourcingReduxServerFeature';
import { EventSourcingFeature } from '@triviality/eventsourcing/EventSourcingFeature';
import { EventStore } from '@triviality/eventsourcing/EventStore/EventStore';
import { FileEventStore } from '@triviality/eventsourcing/EventStore/FileEventStore';
import { LoggerFeature } from '@triviality/logger';
import { SerializerFeature } from '@triviality/serializer';
import { IndexController } from './Controller/IndexController';

export class WebFeature implements Feature {

  constructor(private container: Container<LoggerFeature, SerializerFeature, EventsourcingReduxServerFeature>) {
  }

  public serviceOverrides(): OptionalContainer<EventSourcingFeature> {
    return {
      eventStore: (): EventStore => {
        return FileEventStore.fromFile('events.json', this.container.serializer());
      },
    };
  }

  public async setup() {
    const app = this.container.expressApp();
    app.get('*', this.indexController().action.bind(this.indexController()));
  }

  public indexController() {
    return new IndexController();
  }
}
