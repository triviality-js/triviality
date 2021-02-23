import {GlobalInvokeStack} from "../GlobalInvokeStack";

export class ContainerError extends Error {

  constructor(message: string) {
    super(message + ` (${GlobalInvokeStack.printStack()})`);
    Object.setPrototypeOf(this, ContainerError.prototype);
    this.name = this.constructor.name;
  }
}
