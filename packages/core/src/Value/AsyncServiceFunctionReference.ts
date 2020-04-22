import { BaseServiceFactoryReference } from './BaseServiceFactoryReference';
import { FeatureFactory } from '../FeatureFactory';
import { AsyncServiceFunctionReferenceError } from './AsyncServiceFunctionReferenceError';

/**
 */
export class AsyncServiceFunctionReference extends BaseServiceFactoryReference {
  private promise: Promise<any> | null = null;
  public readonly type = 'async';

  constructor(private async: () => Promise<any>, feature: FeatureFactory<any>) {
    super({
      feature,
      factory: () => {
        /**
         * Wait for all other services to complete, they can start fetching this service.
         * This will throw the async error, the service start waiting on the error thrown.
         *
         * TODO: find more useful solution.
         */
        if (!this.hasServiceInstance()) {
          throw new AsyncServiceFunctionReferenceError(this.wait);
        }
        return this.getService();
      },
    });
  }

  public label() {
    return 'async';
  }

  /**
   * Wait for this service to be invoked.
   */
  public wait = async (): Promise<void> => {
    if (this.promise) {
      await this.promise;
      return;
    }
    this.promise = this
      .async()
      .then((service) => {
        this.service = service;
        this.serviceFactoryInvoked = true;
        this.serviceDefined = true;
      }).catch((e) => {
        if (e instanceof AsyncServiceFunctionReferenceError) {
          this.promise = null;
          return Promise.resolve();
        }
        throw e;
      });
    await this.promise;
  };
}
