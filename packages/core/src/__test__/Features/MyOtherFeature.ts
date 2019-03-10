import { Feature } from '../../Type/Feature';
import { Container } from '../../Type/Container';
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
