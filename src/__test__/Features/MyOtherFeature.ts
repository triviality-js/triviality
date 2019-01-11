import { Feature } from '../../Feature';
import { Container } from '../../Container';
import { MyFeature } from './MyFeature';

export class MyOtherFeature implements Feature {

  constructor(private container: Container<MyFeature>) {

  }

  public myOtherFeature(): string {
    return 'MyOtherFeature';
  }

  public referenceToMyFeature(): string {
    return this.container.myFeature();
  }

}
