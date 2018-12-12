import { Module } from '../../Module';
import { Container } from '../../Container';
import { MyModule } from './MyModule';

export class MyOtherModule implements Module {

  constructor(private container: Container<MyModule>) {

  }

  public myOtherModule() {
    return 'MyOtherModule';
  }

  public referenceToMyModule() {
    return this.container.myModule();
  }

}
