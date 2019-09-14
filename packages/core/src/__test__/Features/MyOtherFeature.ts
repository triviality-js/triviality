export const MyOtherFeature = ({ myFeature }: { myFeature: () => string }) => ({
  myOtherFeature(): string {
    return 'MyOtherFeature';
  },

  referenceToMyFeature(): string {
    return myFeature();
  },
});
