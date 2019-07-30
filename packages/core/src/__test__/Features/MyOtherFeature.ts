export const MyOtherFeature = ({ myFeature }: { myFeature: () => string }) => ({
  services: {
    myOtherFeature(): string {
      return 'MyOtherFeature';
    },

    referenceToMyFeature(): string {
      return myFeature();
    },
  },
});
