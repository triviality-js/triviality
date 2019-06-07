import { triviality } from '@triviality/core';
import { DefaultLoggerFeature } from '@triviality/logger';
import { TransitJsSerializerFeature } from '@triviality/serializer/transit-js';
import { CommonFeature } from '../shared/CommonFeature';
import { AccountFeature } from './Account/AccountFeature';
import { AppFeature } from './App/AppFeature';
import { ChatEventsourcingReduxFeature, ChatReduxFeature } from './ChatReduxFeature';

export function serviceContainerFactory() {
  return triviality()
    .add(DefaultLoggerFeature)
    .add(TransitJsSerializerFeature)
    .add(CommonFeature)
    .add(ChatReduxFeature)
    .add(AccountFeature)
    .add(ChatEventsourcingReduxFeature)
    .add(AppFeature);
}
