
it('Make sure example is not broken', (done) => {
  const info = (console as any).info;
  const spy = jest.fn(() => {
    expect(spy).toBeCalledWith('Hallo World');
    (console as any).info = info;
    done();
  });
  (console as any).info = spy;
  require('../intro.ts');
});
