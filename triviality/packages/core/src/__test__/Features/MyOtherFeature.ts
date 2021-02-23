import {FeatureFactoryContext} from "../../Context";
import {FF} from "@triviality/core";

export interface MyOtherFeatureServices {
  myOtherFeature: string;
  referenceToMyFeature: string;
}

export interface MyOtherFeatureDependencies {
  myFeature: string;
}

export const MyOtherFeature: FF<MyOtherFeatureServices, MyOtherFeatureDependencies> = ({dependencies: {myFeature}}) => ({
  myOtherFeature(): string {
    return 'MyOtherFeature';
  },

  referenceToMyFeature(): string {
    return myFeature();
  },
});
