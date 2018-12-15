import { StrippedModule, ModuleRegistries, Module } from './Module';

export type C<T extends Module> =  ModuleRegistries<T> & StrippedModule<T>;

export type Container<M1 = {}, M2 = {}, M3 = {}, M4 = {}, M5 = {}, M6 = {}, M7 = {}, M8 = {}, M9 = {}, M10 = {}, M11 = {}, M12 = {}, M13 = {}, M14 = {}, M15 = {}, M16 = {}, M17 = {}, M18 = {}, M19 = {}, M20 = {}> = C<M1> & C<M2> & C<M3> & C<M4> & C<M5> & C<M6> & C<M7> & C<M8> & C<M9> & C<M10> & C<M11> & C<M12> & C<M13> & C<M14> & C<M15> & C<M16> & C<M17> & C<M18> & C<M19> & C<M20>;
