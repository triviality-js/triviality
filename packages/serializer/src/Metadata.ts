import { ClassConstructor } from './ClassConstructor';

export const METADATA_SYMBOL = Symbol.for('triviality-metadata');

/**
 * TODO: solve issue why 'reflect-metadata' does not work outside of this project if there are multiple instances.
 */
export class Metadata {

  public static defineMetadata(key: symbol | string, metadata: any, target: ClassConstructor<any>)  {
    const classMetadata = this.getByTarget(target);
    return classMetadata[key.toString()] = metadata;
  }

  public static getMetadata(key: symbol | string, target: ClassConstructor<any>)  {
    const classMetadata = this.getByTarget(target);
    return classMetadata[key.toString()];
  }

  private static getByTarget(target: any): any {
    if (target[METADATA_SYMBOL]) {
      return target[METADATA_SYMBOL];
    }
    target[METADATA_SYMBOL] = [];
    return target[METADATA_SYMBOL];
  }
}
