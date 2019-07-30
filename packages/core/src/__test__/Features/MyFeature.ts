import { FeatureInstance } from '../..';

export const MyFeature = (): FeatureInstance => ({
  services: {
    myFeature(): string {
      return 'MyFeature';
    },
  },
});
