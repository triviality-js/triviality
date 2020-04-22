import { FF } from '@triviality/core';
import { BaseReduxFeature, BaseReduxFeatureServices } from './BaseReduxFeature';
import { DevReduxFeature, DevReduxFeatureServices } from './DevReduxFeature';
import { ReduxEpicFeature, ReduxEpicFeatureServices } from './EpicReduxFeature';
import { Action, AnyAction } from 'redux';

export type ReduxFeatureServices<S = any, A extends Action = AnyAction, D = {}> =
  BaseReduxFeatureServices<S, A>
  & DevReduxFeatureServices
  & ReduxEpicFeatureServices<S, A, D>;

export const ReduxFeature: <S = any, A extends Action = AnyAction, D = {}>() => FF<ReduxFeatureServices<S, A, D>> =
  <S = any, A extends Action = AnyAction, D = {}>() => ({ merge }) =>
    merge(BaseReduxFeature<S, A>())
      .with(ReduxEpicFeature<S, A, D>())
      .with(DevReduxFeature)
      .all() as any;
