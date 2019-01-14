import { FeatureRegistries as FR } from './value/FeatureTypes';
import { Optional } from './util/Types';

/**
 * Return type for all registries from multiple Features.
 *
 * Registries<Feature1, Feature2, etc>
 */
export type Registries<F1 = null, F2 = null, F3 = null, F4 = null, F5 = null, F6 = null, F7 = null, F8 = null, F9 = null, F10 = null, F11 = null, F12 = null, F13 = null, F14 = null, F15 = null, F16 = null, F17 = null, F18 = null, F19 = null, F20 = null>
  = Readonly<(FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10> & FR<F11> & FR<F12> & FR<F13> & FR<F14> & FR<F15> & FR<F16> & FR<F17> & FR<F18> & FR<F19> & FR<F20>)>;

/**
 * All registries are option, used for type hinds for some part of a registry.
 *
 * {@see Registries}
 */
export type OptionalRegistries<F1 = null, F2 = null, F3 = null, F4 = null, F5 = null, F6 = null, F7 = null, F8 = null, F9 = null, F10 = null, F11 = null, F12 = null, F13 = null, F14 = null, F15 = null, F16 = null, F17 = null, F18 = null, F19 = null, F20 = null>
  = Optional<Registries<F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20>>;
