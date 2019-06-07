import { OptionalFeatureRegistries as FR, OptionalFeatureServices as FS } from './FeatureTypes';
import { HasRegistries } from './Registry';
import { Optional } from '../util/Types';

export type ServiceContainer<S, R> = Readonly<S & HasRegistries<R>>;

/**
 * Type to express a service container by features.
 *
 * Example:
 *
 * class MyFeature {
 *
 *  constructor(private container: Container<FeatureOne, FeatureTwo, etc..>)
 *
 */
export type Container<F1 = null, F2 = null, F3 = null, F4 = null, F5 = null, F6 = null, F7 = null, F8 = null, F9 = null, F10 = null, F11 = null, F12 = null, F13 = null, F14 = null, F15 = null, F16 = null, F17 = null, F18 = null, F19 = null, F20 = null, R = (FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10> & FR<F11> & FR<F12> & FR<F13> & FR<F14> & FR<F15> & FR<F16> & FR<F17> & FR<F18> & FR<F19> & FR<F20>)> =
  Readonly<FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10> & FS<F11> & FS<F12> & FS<F13> & FS<F14> & FS<F15> & FS<F16> & FS<F17> & FS<F18> & FS<F19> & FS<F20>>
  & Readonly<HasRegistries<R>>;

export type OptionalContainer<F1 = null, F2 = null, F3 = null, F4 = null, F5 = null, F6 = null, F7 = null, F8 = null, F9 = null, F10 = null, F11 = null, F12 = null, F13 = null, F14 = null, F15 = null, F16 = null, F17 = null, F18 = null, F19 = null, F20 = null> =
  Optional<Container<F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20>>;
