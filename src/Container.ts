import { OptionalFeatureRegistries as FR, OptionalFeatureServices as C } from './value/FeatureTypes';
import { HasRegistries } from './value/Registry';

/**
 * Type to express a container by feature dependencies.
 *
 * Example:
 *
 * class MyFeature {
 *
 *  constructor(private container: Container<FeatureOne, FeatureTwo, etc..>)
 *
 */
export type Container<F1 = null, F2 = null, F3 = null, F4 = null, F5 = null, F6 = null, F7 = null, F8 = null, F9 = null, F10 = null, F11 = null, F12 = null, F13 = null, F14 = null, F15 = null, F16 = null, F17 = null, F18 = null, F19 = null, F20 = null, R = (FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10> & FR<F11> & FR<F12> & FR<F13> & FR<F14> & FR<F15> & FR<F16> & FR<F17> & FR<F18> & FR<F19> & FR<F20>)> =
  Readonly<C<F1> & C<F2> & C<F3> & C<F4> & C<F5> & C<F6> & C<F7> & C<F8> & C<F9> & C<F10> & C<F11> & C<F12> & C<F13> & C<F14> & C<F15> & C<F16> & C<F17> & C<F18> & C<F19> & C<F20>>
  & HasRegistries<R>;
