import { ModuleConstructor, ModuleConstructor as MC, ModuleOptionalRegistries as MO, ModuleRegistries as MR, StrippedModule as SM } from './value/ModuleTypes';
import { ContainerError } from './ContainerError';
import { BuildableContainer } from './value/BuildableContainer';
import { ModuleDependencyCollection } from './value/ModuleDependencyCollection';
import { ModuleDependency } from './value/ModuleDependency';
import { getAllPropertyValues } from './util/getAllPropertyNames';

/**
 * Container factory.
 */
export class ContainerFactory<C /* Container */, R /* Registry */> {

  public static create(): ContainerFactory<{}, {}> {
    const factory = new ContainerFactory<{}, {}>(new BuildableContainer({}));
    return (factory as any);
  }

  private moduleClasses: Array<ModuleConstructor<any, C>> = [];
  private modules: ModuleDependencyCollection = new ModuleDependencyCollection();
  private isBuild = false;

  private constructor(private container: BuildableContainer<C>) {
  }

  /**
   * Only add modules as second argument when there are circular dependencies between them.
   */
  public add<M1 extends MO<R, C>, NC = (C & SM<M1>), NR = (R & MR<M1>)>(m1: MC<M1, C>): ContainerFactory<NC, NR>;
  public add<M1 extends MO<R, C>, M2 extends MO<R, C>, NC = (C & SM<M1> & SM<M2>), NR = (R & MR<M1> & MR<M2>)>(m1: MC<M1, C & SM<M2>>, m2: MC<M2, C & SM<M1>>): ContainerFactory<NC, NR>;
  public add<M1 extends MO<R, C>, M2 extends MO<R, C>, M3 extends MO<R, C>, NC = (C & SM<M1> & SM<M2> & SM<M3>), NR = (R & MR<M1> & MR<M2> & MR<M3>)>(m1: MC<M1, C & SM<M2> & SM<M3>>, m2: MC<M2, C & SM<M1> & SM<M3>>, m3: MC<M3, C & SM<M1> & SM<M2>>): ContainerFactory<NC, NR>;
  public add<M1 extends MO<R, C>, M2 extends MO<R, C>, M3 extends MO<R, C>, M4 extends MO<R, C>, NC = (C & SM<M1> & SM<M2> & SM<M3> & SM<M4>), NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3>>): ContainerFactory<NC, NR>;
  public add<M1 extends MO<R, C>, M2 extends MO<R, C>, M3 extends MO<R, C>, M4 extends MO<R, C>, M5 extends MO<R, C>, NC = (C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5>), NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4>>): ContainerFactory<NC, NR>;
  public add<M1 extends MO<R, C>, M2 extends MO<R, C>, M3 extends MO<R, C>, M4 extends MO<R, C>, M5 extends MO<R, C>, M6 extends MO<R, C>, NC = (C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6>), NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5> & MR<M6>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5> & SM<M6>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5> & SM<M6>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5> & SM<M6>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M6>>, m6: MC<M6, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5>>): ContainerFactory<NC, NR>;
  public add<M1 extends MO<R, C>, M2 extends MO<R, C>, M3 extends MO<R, C>, M4 extends MO<R, C>, M5 extends MO<R, C>, M6 extends MO<R, C>, M7 extends MO<R, C>, NC = (C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7>), NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5> & MR<M6> & MR<M7>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5> & SM<M6> & SM<M7>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5> & SM<M6> & SM<M7>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M6> & SM<M7>>, m6: MC<M6, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M7>>, m7: MC<M7, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6>>): ContainerFactory<NC, NR>;
  public add<M1 extends MO<R, C>, M2 extends MO<R, C>, M3 extends MO<R, C>, M4 extends MO<R, C>, M5 extends MO<R, C>, M6 extends MO<R, C>, M7 extends MO<R, C>, M8 extends MO<R, C>, NC = (C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8>), NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5> & MR<M6> & MR<M7> & MR<M8>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5> & SM<M6> & SM<M7> & SM<M8>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M6> & SM<M7> & SM<M8>>, m6: MC<M6, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M7> & SM<M8>>, m7: MC<M7, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M8>>, m8: MC<M8, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7>>): ContainerFactory<NC, NR>;
  public add<M1 extends MO<R, C>, M2 extends MO<R, C>, M3 extends MO<R, C>, M4 extends MO<R, C>, M5 extends MO<R, C>, M6 extends MO<R, C>, M7 extends MO<R, C>, M8 extends MO<R, C>, M9 extends MO<R, C>, NC = (C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>), NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5> & MR<M6> & MR<M7> & MR<M8> & MR<M9>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>, m6: MC<M6, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M7> & SM<M8> & SM<M9>>, m7: MC<M7, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M8> & SM<M9>>, m8: MC<M8, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M9>>, m9: MC<M9, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8>>): ContainerFactory<NC, NR>;
  public add<M1 extends MO<R, C>, M2 extends MO<R, C>, M3 extends MO<R, C>, M4 extends MO<R, C>, M5 extends MO<R, C>, M6 extends MO<R, C>, M7 extends MO<R, C>, M8 extends MO<R, C>, M9 extends MO<R, C>, M10 extends MO<R, C>, NC = (C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>), NR = (R & MR<M1> & MR<M2> & MR<M3> & MR<M4> & MR<M5> & MR<M6> & MR<M7> & MR<M8> & MR<M9> & MR<M10>)>(m1: MC<M1, C & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m2: MC<M2, C & SM<M1> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m3: MC<M3, C & SM<M1> & SM<M2> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m4: MC<M4, C & SM<M1> & SM<M2> & SM<M3> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m5: MC<M5, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M6> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m6: MC<M6, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M7> & SM<M8> & SM<M9> & SM<M10>>, m7: MC<M7, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M8> & SM<M9> & SM<M10>>, m8: MC<M8, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M9> & SM<M10>>, m9: MC<M9, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M10>>, m10: MC<M10, C & SM<M1> & SM<M2> & SM<M3> & SM<M4> & SM<M5> & SM<M6> & SM<M7> & SM<M8> & SM<M9>>): ContainerFactory<NC, NR>;
  public add(...moduleClasses: Array<ModuleConstructor<any, C>>): ContainerFactory<any, any> {
    this.assertNotYetBuild();
    for (const ModuleClass of moduleClasses) {
      this.moduleClasses.push(ModuleClass);
    }
    return this;
  }

  public async build(): Promise<C & { registries: () => R }> {
    this.assertNotYetBuild();
    this.combineServices();
    this.combineRegistries();
    this.isBuild = true;
    await this.overrideServices();
    this.container.freezeContainer();
    await this.setup();
    return this.container.getReference() as any;
  }

  private combineServices() {
    for (const ModuleClass of this.moduleClasses) {
      const module = new ModuleDependency(new ModuleClass(this.container.getReference()));
      this.modules.add(module);
      for (const [name, value] of module.getServices()) {
        this.container.defineLockedModuleService(module, name, value);
      }
    }
  }

  private combineRegistries() {
    const registries = this.modules.getRegistries();
    this.container.defineLockedService('registries', () => registries);
    for (const module of this.modules.withRegistries().toArray()) {
      module.defineProperty(this.container, 'registries' as any);
    }
  }

  private async setup() {
    for (const module of this.modules.withSetupsFunctions().toArray()) {
      await module.getSetupFunction()();
    }
  }

  private async overrideServices() {
    for (const module of this.modules.withServiceOverridesFunctions().toArray()) {
      const container = this.container.getOverrideableReferenceContainer();
      const returnValue = await module.getServiceOverrideFunction()(container.getReference());
      if (container.getReference() === returnValue || this.container.getReference() === returnValue) {
        throw ContainerError.shouldReturnNewObjectWithServices();
      }
      const overrides = getAllPropertyValues(returnValue);
      if (overrides.length === 0) {
        container.freezeContainer();
        continue;
      }
      for (const [name, value] of overrides) {
        container.overrideService(name, value);
      }
      container.freezeContainer();
    }
  }

  private assertNotYetBuild() {
    if (this.isBuild) {
      throw ContainerError.containerAlreadyBuild();
    }
  }
}
