import { ClassConstructor } from '../ClassConstructor';

export interface SerializeHandler {
  /**
   * a unique identifier for this type that will be used in the serialised output
   */
  tag: string;
  /**
   * a constructor function that can be used to identify the type via an instanceof check
   */
  class: ClassConstructor<any>;

  /**
   * a function which will receive an instance of your type, and is expected to create some serializable representation of it.
   */
  write(instance: any): any;

  /**
   * a function which will receive the serializable representation, and is expected to create a new instance from it
   */
  read(instance: any): any;
}
