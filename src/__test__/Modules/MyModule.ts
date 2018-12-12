import { Module } from '../../Module';
import { Container } from '../../Container';
import { MyOtherModule } from './MyOtherModule';

export class MyModule implements Module {

  constructor(private container: Container<MyOtherModule>) {

  }

  public myModule() {
    return 'MyModule';
  }

  public referenceToMyOtherModule() {
    return this.container.myOtherModule();
  }

}
