import {
  Module,
  Module as M,
  ModuleConstructor,
  ModuleConstructor as MC,
  ModuleRegistries as MR,
  StrippedModule as SM,
} from './Module';
import { getAllPropertyNames } from './util/getAllPropertyNames';
import memorize from 'lodash.memoize';
import { ContainerError } from './ContainerError';
import { Optional as O } from './util/Types';

/**
 * Container factory.
 */
export class ContainerFactory<C /* Container */, R /* Registry */> {

  public static create(): ContainerFactory<{}, {}> {
    const factory = new ContainerFactory<{}, {}>({});
    return (factory as any);
  }

  private modules: Module[] = [];
  private isBuild = false;

  private constructor(private container: C) {
  }

  /**
   * Only add modules as second argument when there are circular dependencies between them.
   */
  public add<M1 extends M<O<R>>, NR = (R & MR<M1>)>(m1: MC<M1, C>): ContainerFactory<C & SM<M1>, NR>;
  public add<M1 extends M<O<R>>, M2 extends M<O<R>>, NR = (R & MR<M1> & MR<M2>)>(m1: MC<M1, C & SM<M2>>, m2: MC<M2, C & SM<M1>>): ContainerFactory<C & SM<M1> & SM<M2>, NR>;
  public add<M1 extends M<O<R>>, M2 extends M<O<R>>, M3 extends M<O<R>>, NR = (R & MR<M1> & MR<M2> & MR<M3>)>(m1: MC<M1, C & SM<M2> & SM<M3>>, m2: MC<M2, C & SM<M1> & SM<M3>>, m3: MC<M3, C & SM<M1> & SM<M2>>): ContainerFactory<C & SM<M1> & SM<M2> & SM<M3>, NR>;
  public add<M1 extends M<O<R>>, M2 extends M<O<R>>, M3 extends M<O<R>>, M4 extends M<O<R>>, NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3>>): ContainerFactory<C & SM<M1> & SM<M2> & SM<M3> & SM<M4>, NR>;
  public add<M1 extends M<O<R>>, M2 extends M<O<R>>, M3 extends M<O<R>>, M4 extends M<O<R>>, M5 extends M<O<R>>, NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4>>): ContainerFactory<C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5>, NR>;
  public add<M1 extends M<O<R>>, M2 extends M<O<R>>, M3 extends M<O<R>>, M4 extends M<O<R>>, M5 extends M<O<R>>, M6 extends M<O<R>>, NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5> & MR<M6>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5> & SM<M6>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5> & SM<M6>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5> & SM<M6>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M6>>, m6: MC<M6, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5>>): ContainerFactory<C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6>, NR>;
  public add<M1 extends M<O<R>>, M2 extends M<O<R>>, M3 extends M<O<R>>, M4 extends M<O<R>>, M5 extends M<O<R>>, M6 extends M<O<R>>, M7 extends M<O<R>>, NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5> & MR<M6> & MR<M7>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5> & SM<M6> & SM<M7>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5> & SM<M6> & SM<M7>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M6> & SM<M7>>, m6: MC<M6, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M7>>, m7: MC<M7, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6>>): ContainerFactory<C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7>, NR>;
  public add<M1 extends M<O<R>>, M2 extends M<O<R>>, M3 extends M<O<R>>, M4 extends M<O<R>>, M5 extends M<O<R>>, M6 extends M<O<R>>, M7 extends M<O<R>>, M8 extends M<O<R>>, NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5> & MR<M6> & MR<M7> & MR<M8>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5> & SM<M6> & SM<M7> & SM<M8>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M6> & SM<M7> & SM<M8>>, m6: MC<M6, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M7> & SM<M8>>, m7: MC<M7, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M8>>, m8: MC<M8, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7>>): ContainerFactory<C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8>, NR>;
  public add<M1 extends M<O<R>>, M2 extends M<O<R>>, M3 extends M<O<R>>, M4 extends M<O<R>>, M5 extends M<O<R>>, M6 extends M<O<R>>, M7 extends M<O<R>>, M8 extends M<O<R>>, M9 extends M<O<R>>, NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5> & MR<M6> & MR<M7> & MR<M8> & MR<M9>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>, m6: MC<M6, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M7> & SM<M8> & SM<M9>>, m7: MC<M7, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M8> & SM<M9>>, m8: MC<M8, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M9>>, m9: MC<M9, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8>>): ContainerFactory<C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>, NR>;
  public add<M1 extends M<O<R>>, M2 extends M<O<R>>, M3 extends M<O<R>>, M4 extends M<O<R>>, M5 extends M<O<R>>, M6 extends M<O<R>>, M7 extends M<O<R>>, M8 extends M<O<R>>, M9 extends M<O<R>>, M10 extends M<O<R>>, NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5> & MR<M6> & MR<M7> & MR<M8> & MR<M9> & MR<M10>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m6: MC<M6, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m7: MC<M7, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M8> & SM<M9> & SM<M10>>, m8: MC<M8, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M9> & SM<M10>>, m9: MC<M9, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M10>>, m10: MC<M10, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>): ContainerFactory<C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>, NR>;
  public add(...moduleClasses: Array<ModuleConstructor<any, C>>): ContainerFactory<any, any> {
    if (this.isBuild) {
      throw ContainerError.containerAlreadyBuild();
    }
    for (const moduleClass of moduleClasses) {
      this.addModule(new moduleClass(this.container));
    }
    return this;
  }

  public async build(): Promise<C & R> {
    if (this.isBuild) {
      throw ContainerError.containerAlreadyBuild();
    }
    this.isBuild = true;
    this.combineRegistries();
    this.setup();
    return this.container as any;
  }

  private combineRegistries() {
    const combined: { [name: string]: any[] } = {};
    for (const module of this.modules) {
      if (module.registries) {
        const registers: any = module.registries();
        for (const register of Object.getOwnPropertyNames(registers)) {
          if (!combined[register]) {
            combined[register] = [];
          }
          const registered: any[] = registers[register]();
          if (registered) {
            if (!registered.forEach) {
              throw ContainerError.wrongRegisterReturnType(register);
            }
            registered.forEach((value) => {
              combined[register].push(value);
            });
          }
        }
      }
    }
    for (const register of Object.getOwnPropertyNames(combined)) {
      this.defineContainerProperty(register, () => combined[register]);
    }
    this.defineContainerProperty('registries', () => this.container);
  }

  private addModule(module: Module) {
    this.modules.push(module);
    for (const name of getAllPropertyNames(module)) {
      const value = module[name];
      if (['registries', 'setup'].indexOf(name) >= 0) {
        continue;
      }
      if (typeof value === 'function') {
        this.defineContainerProperty(name, memorize(value, (...args) => JSON.stringify(args)));
        module[name] = (this.container as any)[name].bind(this.container);
      } else {
        this.defineContainerProperty(name, value);
      }
    }
  }

  private defineContainerProperty(name: string, value: any) {
    if ((this.container as any)[name]) {
      // Ignore if it's a reference to the container
      if (value === this.container) {
        return;
      }
      throw ContainerError.propertyOrServiceAlreadyDefined(name);
    }
    Object.defineProperty(this.container, name, { get: () => value, set: () => { throw ContainerError.containerIsLocked(name); } });
  }

  private setup() {
    for (const module of this.modules) {
      if (module.setup) {
        module.setup();
      }
    }
  }
}
