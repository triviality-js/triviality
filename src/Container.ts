import { OptionalModuleDependency as C } from './Module';

export type Container<M1 = null, M2 = null, M3 = null, M4 = null, M5 = null, M6 = null, M7 = null, M8 = null, M9 = null, M10 = null, M11 = null, M12 = null, M13 = null, M14 = null, M15 = null, M16 = null, M17 = null, M18 = null, M19 = null, M20 = null> = Readonly<C<M1> & C<M2> & C<M3> & C<M4> & C<M5> & C<M6> & C<M7> & C<M8> & C<M9> & C<M10> & C<M11> & C<M12> & C<M13> & C<M14> & C<M15> & C<M16> & C<M17> & C<M18> & C<M19> & C<M20>>;
