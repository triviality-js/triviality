import { FeatureConstructor, FeatureConstructor as FC, FeatureOptionalRegistries as FO, FeatureRegistries as FR, FeatureServices as FS } from './value/FeatureTypes';
import { ContainerError } from './ContainerError';
import { BuildableContainer } from './value/BuildableContainer';
import { FeatureDependencyCollection } from './value/FeatureDependencyCollection';
import { FeatureDependency } from './value/FeatureDependency';
import { getAllPropertyValues } from './util/getAllPropertyNames';
import { HasRegistries } from './value/Registry';

/**
 * Container factory.
 */
export class ContainerFactory<C /* Container */, R /* Registry */> {

  public static create(): ContainerFactory<{}, {}> {
    const factory = new ContainerFactory<{}, {}>(new BuildableContainer({}));
    return (factory as any);
  }

  private featureClasses: Array<FeatureConstructor<any, C, R>> = [];
  private feature: FeatureDependencyCollection = new FeatureDependencyCollection();
  private isBuild = false;

  private constructor(private container: BuildableContainer<C>) {
  }

  /**
   * Only add feature as second argument when there are circular dependencies between them.
   */
  public add<F1 extends FO<C, R>, NC = (C & FS<F1>), NR = (R & FR<F1>)>(f1: FC<F1, C, R>): ContainerFactory<NC, NR>;
  public add<F1 extends FO<C, R>, F2 extends FO<C, R>, NC = (C & FS<F1> & FS<F2>), NR = (R & FR<F1> & FR<F2>)>(f1: FC<F1, C & FS<F2>, R & FR<F2>>, f2: FC<F2, C & FS<F1>, R & FR<F1>>): ContainerFactory<NC, NR>;
  public add<F1 extends FO<C, R>, F2 extends FO<C, R>, F3 extends FO<C, R>, NC = (C & FS<F1> & FS<F2> & FS<F3>), NR = (R & FR<F1> & FR<F2> & FR<F3>)>(f1: FC<F1, C & FS<F2> & FS<F3>, R & FR<F2> & FR<F3>>, f2: FC<F2, C & FS<F1> & FS<F3>, R & FR<F1> & FR<F3>>, f3: FC<F3, C & FS<F1> & FS<F2>, R & FR<F1> & FR<F2>>): ContainerFactory<NC, NR>;
  public add<F1 extends FO<C, R>, F2 extends FO<C, R>, F3 extends FO<C, R>, F4 extends FO<C, R>, NC = (C & FS<F1> & FS<F2> & FS<F3> & FS<F4>), NR = (R & FR<F1> & FR<F2> & FR<F3> & FR<F4>)>(f1: FC<F1, C & FS<F2> & FS<F3> & FS<F4>, R & FR<F2> & FR<F3> & FR<F4>>, f2: FC<F2, C & FS<F1> & FS<F3> & FS<F4>, R & FR<F1> & FR<F3> & FR<F4>>, f3: FC<F3, C & FS<F1> & FS<F2> & FS<F4>, R & FR<F1> & FR<F2> & FR<F4>>, f4: FC<F4, C & FS<F1> & FS<F2> & FS<F3>, R & FR<F1> & FR<F2> & FR<F3>>): ContainerFactory<NC, NR>;
  public add<F1 extends FO<C, R>, F2 extends FO<C, R>, F3 extends FO<C, R>, F4 extends FO<C, R>, F5 extends FO<C, R>, NC = (C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5>), NR = (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5>)>(f1: FC<F1, C & FS<F2> & FS<F3> & FS<F4> & FS<F5>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5>>, f2: FC<F2, C & FS<F1> & FS<F3> & FS<F4> & FS<F5>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5>>, f3: FC<F3, C & FS<F1> & FS<F2> & FS<F4> & FS<F5>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5>>, f4: FC<F4, C & FS<F1> & FS<F2> & FS<F3> & FS<F5>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5>>, f5: FC<F5, C & FS<F1> & FS<F2> & FS<F3> & FS<F4>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4>>): ContainerFactory<NC, NR>;
  public add<F1 extends FO<C, R>, F2 extends FO<C, R>, F3 extends FO<C, R>, F4 extends FO<C, R>, F5 extends FO<C, R>, F6 extends FO<C, R>, NC = (C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6>), NR = (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6>)>(f1: FC<F1, C & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6>>, f2: FC<F2, C & FS<F1> & FS<F3> & FS<F4> & FS<F5> & FS<F6>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5> & FR<F6>>, f3: FC<F3, C & FS<F1> & FS<F2> & FS<F4> & FS<F5> & FS<F6>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5> & FR<F6>>, f4: FC<F4, C & FS<F1> & FS<F2> & FS<F3> & FS<F5> & FS<F6>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5> & FR<F6>>, f5: FC<F5, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F6>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F6>>, f6: FC<F6, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5>>): ContainerFactory<NC, NR>;
  public add<F1 extends FO<C, R>, F2 extends FO<C, R>, F3 extends FO<C, R>, F4 extends FO<C, R>, F5 extends FO<C, R>, F6 extends FO<C, R>, F7 extends FO<C, R>, NC = (C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7>), NR = (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7>)>(f1: FC<F1, C & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7>>, f2: FC<F2, C & FS<F1> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7>>, f3: FC<F3, C & FS<F1> & FS<F2> & FS<F4> & FS<F5> & FS<F6> & FS<F7>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5> & FR<F6> & FR<F7>>, f4: FC<F4, C & FS<F1> & FS<F2> & FS<F3> & FS<F5> & FS<F6> & FS<F7>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5> & FR<F6> & FR<F7>>, f5: FC<F5, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F6> & FS<F7>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F6> & FR<F7>>, f6: FC<F6, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F7>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F7>>, f7: FC<F7, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6>>): ContainerFactory<NC, NR>;
  public add<F1 extends FO<C, R>, F2 extends FO<C, R>, F3 extends FO<C, R>, F4 extends FO<C, R>, F5 extends FO<C, R>, F6 extends FO<C, R>, F7 extends FO<C, R>, F8 extends FO<C, R>, NC = (C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8>), NR = (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8>)>(f1: FC<F1, C & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8>>, f2: FC<F2, C & FS<F1> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8>>, f3: FC<F3, C & FS<F1> & FS<F2> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8>>, f4: FC<F4, C & FS<F1> & FS<F2> & FS<F3> & FS<F5> & FS<F6> & FS<F7> & FS<F8>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5> & FR<F6> & FR<F7> & FR<F8>>, f5: FC<F5, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F6> & FS<F7> & FS<F8>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F6> & FR<F7> & FR<F8>>, f6: FC<F6, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F7> & FS<F8>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F7> & FR<F8>>, f7: FC<F7, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F8>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F8>>, f8: FC<F8, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7>>): ContainerFactory<NC, NR>;
  public add<F1 extends FO<C, R>, F2 extends FO<C, R>, F3 extends FO<C, R>, F4 extends FO<C, R>, F5 extends FO<C, R>, F6 extends FO<C, R>, F7 extends FO<C, R>, F8 extends FO<C, R>, F9 extends FO<C, R>, NC = (C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>), NR = (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>)>(f1: FC<F1, C & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>, f2: FC<F2, C & FS<F1> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>, f3: FC<F3, C & FS<F1> & FS<F2> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>, f4: FC<F4, C & FS<F1> & FS<F2> & FS<F3> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>, f5: FC<F5, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>, f6: FC<F6, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F7> & FR<F8> & FR<F9>>, f7: FC<F7, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F8> & FR<F9>>, f8: FC<F8, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F9>>, f9: FC<F9, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8>>): ContainerFactory<NC, NR>;
  public add<F1 extends FO<C, R>, F2 extends FO<C, R>, F3 extends FO<C, R>, F4 extends FO<C, R>, F5 extends FO<C, R>, F6 extends FO<C, R>, F7 extends FO<C, R>, F8 extends FO<C, R>, F9 extends FO<C, R>, F10 extends FO<C, R>, NC = (C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>), NR = (R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>)>(f1: FC<F1, C & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f2: FC<F2, C & FS<F1> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f3: FC<F3, C & FS<F1> & FS<F2> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f4: FC<F4, C & FS<F1> & FS<F2> & FS<F3> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f5: FC<F5, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F6> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F6> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f6: FC<F6, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F7> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F7> & FR<F8> & FR<F9> & FR<F10>>, f7: FC<F7, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F8> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F8> & FR<F9> & FR<F10>>, f8: FC<F8, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F9> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F9> & FR<F10>>, f9: FC<F9, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F10>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F10>>, f10: FC<F10, C & FS<F1> & FS<F2> & FS<F3> & FS<F4> & FS<F5> & FS<F6> & FS<F7> & FS<F8> & FS<F9>, R & FR<F1> & FR<F2> & FR<F3> & FR<F4> & FR<F5> & FR<F6> & FR<F7> & FR<F8> & FR<F9>>): ContainerFactory<NC, NR>;
  public add(...featureClasses: Array<FeatureConstructor<any, C, R>>): ContainerFactory<any, any> {
    this.assertNotYetBuild();
    for (const FeatureClass of featureClasses) {
      this.featureClasses.push(FeatureClass);
    }
    return this;
  }

  public async build(): Promise<C & HasRegistries<R>> {
    this.assertNotYetBuild();
    this.isBuild = true;

    this.combineServices();
    await this.overrideServices();
    this.container.freezeContainer();

    await this.combineRegistries();
    this.container.freezeContainer();

    await this.setup();

    return this.container.getReference() as any;
  }

  private combineServices() {
    for (const FeatureClass of this.featureClasses) {
      const feature = new FeatureDependency(new FeatureClass(this.container.getReference() as any));
      this.feature.add(feature);
      for (const [name, service] of feature.getServices()) {
        this.container.defineLockedFeatureervice(feature, name, service);
      }
    }
  }

  private async combineRegistries() {
    const registries = await this.feature.getRegistries();
    this.container.defineLockedService('registries', () => registries);
    for (const feature of this.feature.withRegistries().toArray()) {
      feature.defineProperty(this.container, 'registries' as any);
    }
  }

  private async setup() {
    for (const feature of this.feature.withSetupsFunctions().toArray()) {
      await feature.getSetupFunction()();
    }
  }

  private async overrideServices() {
    for (const feature of this.feature.withServiceOverridesFunctions().toArray()) {
      const container = this.container.getOverrideableReferenceContainer();
      const returnValue = await feature.getServiceOverrideFunction()(container.getReference());
      if (container.getReference() === returnValue || this.container.getReference() === returnValue) {
        throw ContainerError.shouldReturnNewObjectWithServices();
      }
      const overrides = getAllPropertyValues(returnValue);
      if (overrides.length === 0) {
        container.freezeContainer();
        continue;
      }
      for (const [name, service] of overrides) {
        container.overrideService(name, service);
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
