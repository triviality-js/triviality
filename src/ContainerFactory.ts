import { ModuleConstructor as MC, Module as M, ModuleWithoutContainer as W } from './Module';
import { getAllPropertyNames } from './util/getAllPropertyNames';
import memorize from 'lodash.memoize';

export class ContainerFactory<T> {

  public static add<M1 extends M, C extends (W<M1>)>(m1: MC<M1, C>): ContainerFactory<C>;
  public static add<M1 extends M, M2 extends M, C extends (W<M1> & W<M2>)>(m1: MC<M1, C>, m2: MC<M2, C>): ContainerFactory<C>;
  public static add<M1 extends M, M2 extends M, M3 extends M, C extends (W<M1> & W<M2> & W<M3>)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>): ContainerFactory<C>;
  public static add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4>)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>): ContainerFactory<C>;
  public static add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5>)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>): ContainerFactory<C>;
  public static add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, M6 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & W<M6>)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>, m6: MC<M6, C>): ContainerFactory<C>;
  public static add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, M6 extends M, M7 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & W<M6> & W<M7>)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>, m6: MC<M6, C>, m7: MC<M7, C>): ContainerFactory<C>;
  public static add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, M6 extends M, M7 extends M, M8 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & W<M6> & W<M7> & W<M8>)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>, m6: MC<M6, C>, m7: MC<M7, C>, m8: MC<M8, C>): ContainerFactory<C>;
  public static add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, M6 extends M, M7 extends M, M8 extends M, M9 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & W<M6> & W<M7> & W<M8> & W<M9>)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>, m6: MC<M6, C>, m7: MC<M7, C>, m8: MC<M8, C>, m9: MC<M9, C>): ContainerFactory<C>;
  public static add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, M6 extends M, M7 extends M, M8 extends M, M9 extends M, M10 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & W<M6> & W<M7> & W<M8> & W<M9> & W<M10>)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>, m6: MC<M6, C>, m7: MC<M7, C>, m8: MC<M8, C>, m9: MC<M9, C>, m10: MC<M10, C>): ContainerFactory<C>;
  public static add(...moduleClasses: Array<new (container: any) => any>): ContainerFactory<any> {
    const factory = new ContainerFactory<{}>({}, []);
    return (factory as any).add(...moduleClasses);
  }

  private constructor(private container: T, private setups: Array<() => void | Promise<void>>) {

  }

  public add<M1 extends M, C extends (W<M1> & T)>(m1: MC<M1, C>): ContainerFactory<C>;
  public add<M1 extends M, M2 extends M, C extends (W<M1> & W<M2> & T)>(m1: MC<M1, C>, m2: MC<M2, C>): ContainerFactory<C>;
  public add<M1 extends M, M2 extends M, M3 extends M, C extends (W<M1> & W<M2> & W<M3> & T)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>): ContainerFactory<C>;
  public add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & T)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>): ContainerFactory<C>;
  public add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & T)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>): ContainerFactory<C>;
  public add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, M6 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & W<M6> & T)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>, m6: MC<M6, C>): ContainerFactory<C>;
  public add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, M6 extends M, M7 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & W<M6> & W<M7> & T)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>, m6: MC<M6, C>, m7: MC<M7, C>): ContainerFactory<C>;
  public add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, M6 extends M, M7 extends M, M8 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & W<M6> & W<M7> & W<M8> & T)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>, m6: MC<M6, C>, m7: MC<M7, C>, m8: MC<M8, C>): ContainerFactory<C>;
  public add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, M6 extends M, M7 extends M, M8 extends M, M9 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & W<M6> & W<M7> & W<M8> & W<M9> & T)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>, m6: MC<M6, C>, m7: MC<M7, C>, m8: MC<M8, C>, m9: MC<M9, C>): ContainerFactory<C>;
  public add<M1 extends M, M2 extends M, M3 extends M, M4 extends M, M5 extends M, M6 extends M, M7 extends M, M8 extends M, M9 extends M, M10 extends M, C extends (W<M1> & W<M2> & W<M3> & W<M4> & W<M5> & W<M6> & W<M7> & W<M8> & W<M9> & W<M10> & T)>(m1: MC<M1, C>, m2: MC<M2, C>, m3: MC<M3, C>, m4: MC<M4, C>, m5: MC<M5, C>, m6: MC<M6, C>, m7: MC<M7, C>, m8: MC<M8, C>, m9: MC<M9, C>, m10: MC<M10, C>): ContainerFactory<C>;
  public add(...moduleClasses: Array<new (container: T) => any>): ContainerFactory<any> {
    for (const moduleClass of moduleClasses) {
      const module: any = new moduleClass(this.container);
      for (const name of getAllPropertyNames(module)) {
        const value = module[name];
        if (name === 'setup') {
          this.setups.push(value.bind(module));
          continue;
        }
        if (typeof value === 'function') {
          this.setProperty(name, memorize(value));
          module[name] = (this.container as any)[name].bind(this.container);
        } else {
          this.setProperty(name, value);
        }
      }
    }
    return new ContainerFactory<any>(this.container as any, this.setups);
  }

  public async build(): Promise<T> {
    for (const setup of this.setups) {
      await setup();
    }
    return this.container;
  }

  private setProperty(name: string, value: any) {
    if ((this.container as any)[name]) {
      // Ignore if it's a reference to the container
      if (value === this.container) {
        return;
      }
      throw new Error(`Containers service or property already defined "${name}"`);
    }
    Object.defineProperty(this.container, name, { get: () => value, set: () => { throw new Error('Cannot is locked.'); } });
  }

}
