import {GetServiceFactory, ServiceFactoryReference, ServiceFactoryReferences, SFR} from "../ServiceFactoryReference";
import {BuildInfo} from "./BuildInfo";
import {FeatureFactoryBuildInfo} from "./FeatureFactoryBuildInfo";
import {
  createPendingServiceFactoryReference,
  PendingServiceFactoryReference
} from "../../createPendingServiceFactoryReference";
import {FeatureGroupFactoryInterface} from "../../FeatureGroupFactoryInterface";
import {asServiceFactoryReference} from "../../serviceReferenceFactoryInterface";
import type {CompileContext, FeatureFactoryContext} from "../../Context";
import {createFeatureFactoryContext} from "../../Context";
import {FC} from "../FeatureFactory";
import {ContainerError, retryUntilNoAsyncErrors} from "../../Error";
import {GlobalInvokeStack} from "../../GlobalInvokeStack";
import {CompilerPass} from "../CompilerPass";

export class FeatureGroupBuildInfo<S = unknown> extends BuildInfo implements CompileContext<S> {
  protected compilerPasses: CompilerPass[] = [];
  protected features = new Set<FeatureFactoryBuildInfo>();
  /**
   * The SF references. These are returned by all
   *
   * All feature functions are bound to this.
   */
  public readonly references = {} as ServiceFactoryReferences<S>;
  protected readonly pendingReferences: PendingServiceFactoryReference<unknown>[] = [];
  protected nameServiceFactoryIndex = 0;
  protected nameFeatureGroupIndex = 0;
  public readonly serviceReferenceFactory = asServiceFactoryReference;
  public readonly featureContext: FeatureFactoryContext<S> = createFeatureFactoryContext<S>(this);
  public readonly root: FeatureGroupBuildInfo;

  constructor(public readonly name: string, public readonly featureGroupFactory: FeatureGroupFactoryInterface) {
    super();
    this.root = GlobalInvokeStack.current() ? GlobalInvokeStack.getRoot() : this as FeatureGroupBuildInfo;
  }

  public getServices() {
    return this.references;
  }

  public getServiceFactory: GetServiceFactory<S> = <T extends keyof S>(key: T): SFR<S[T]> => {
    if (this.references[key]) {
      return this.references[key];
    }
    const pending = createPendingServiceFactoryReference<S[T]>(key as string);
    this.pendingReferences.push(pending as PendingServiceFactoryReference<unknown>);
    return pending;
  }

  public createPrivateServiceFactoryName() {
    this.nameServiceFactoryIndex += 1;
    return `${this.name}_Private_ServiceFactory${this.nameServiceFactoryIndex}`;
  }

  public createPrivateFeatureGroupName() {
    this.nameFeatureGroupIndex += 1;
    return `${this.name}_Private_ServiceContainer${this.nameFeatureGroupIndex}`;
  }

  public addFeature(feature: FeatureFactoryBuildInfo) {
    this.features.add(feature);
  }

  public getFeatures(): FeatureFactoryBuildInfo[] {
    return Array.from(this.features);
  }

  public resolvePendingReferences() {
    for (const reference of this.pendingReferences) {
      const resolved = (this.references as Record<string, ServiceFactoryReference>)[reference.serviceName];
      if (!resolved) {
        throw new ContainerError(`Service "${reference.serviceName}" is missing.`);
      }
      reference.resolve(resolved);
    }
  }

  public addCompilerPass(cp: CompilerPass) {
    this.compilerPasses.push(cp);
  }

  /**
   * TODO: Split; this class does way to much.
   */
  public async compile() {
    const promises: (Promise<void> | null)[] = [];
    // Execute compiler passes
    await GlobalInvokeStack.runAsync({serviceContainer: this}, async (window) =>
      retryUntilNoAsyncErrors(() =>
        Promise.all(this.compilerPasses.map((setup, index) => {
          if (promises[index]) {
            return promises[index];
          }
          const promise = Promise.resolve(setup(this, this.featureContext));
          promises[index] = promise;
          return promise.catch((e) => {
            promises[index] = null;
            return Promise.reject(e);
          });
        })).then(() => undefined)
      )
    );
    // Merged containers.
    for (const featureFactory of this.getFeatures()) {
      for (const mergedServiceContainer of featureFactory.getContainers()) {
        await mergedServiceContainer.compile();
      }
    }
  }
}
