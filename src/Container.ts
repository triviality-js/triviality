import { ModuleDependency as C } from './Module';

export type Container<M1, M2 = null> = Readonly<M2 extends null | undefined ? C<M1> : (C<M1> & C<M2>)>;
