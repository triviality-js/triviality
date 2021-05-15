import {generateTypesInDirectory, generateCurryInterfaceInDirectory, generateCurryInDirectory} from '@triviality/ts-type-generator';
import * as inspector from "inspector";
import {ignoreElements, tap} from "rxjs/Operators";
import {concat} from "rxjs";

const run = (main: () => void) => {
  const debug = /--debug|--inspect/.test(process.execArgv.join(' '));
  if (debug) {
    const active = inspector.url();
    if (!active) {
      console.info('Wait for debugger');
      (inspector as unknown as { waitForDebugger: () => void }).waitForDebugger();
    } else {
      console.info('Timeout wait for debugger');
      return setTimeout(main, 1000);
    }
  }
  main();
}


run(() => {
  const directory = `${process.cwd()}/packages`;
  console.info("Finding changes in directory:", directory);
  concat(
    generateTypesInDirectory([directory]).pipe(tap((result) => {
      console.info('Types changes:', result);
    })),
    generateCurryInterfaceInDirectory([directory]).pipe(tap((result) => {
      console.info('Curry interfaces changes:', result);
    })),
    generateCurryInDirectory([directory]).pipe(tap((result) => {
      console.info('Curry changes:', result);
    })),
  ).pipe(ignoreElements()).toPromise()
    .then(() => {
      console.info('Done.');
    })
    .catch((e) => {
      console.error(e);
    });
});
