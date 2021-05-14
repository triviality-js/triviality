import {of, OperatorFunction, from, EMPTY} from "rxjs";
import {filesInDirectory} from "../Observable";
import {filter, map, mergeMap, tap, catchError} from "rxjs/Operators";
import fs from "fs";
import * as os from "os";

/**
 * Replaces multiple generators of set of files.
 */
export const generateInDirectory = (name: string, generateDocument: OperatorFunction<string, string>) => (directories: string[], discard?: string[]) =>
  filesInDirectory(directories, discard)
    .pipe(
      mergeMap((directory) => {
        return of(directory.content)
          .pipe(
            mergeMap(async (doc) => doc),
            filter((document) => {
              return document.includes(name);
            }),
            generateDocument,
            catchError((err, caught) => {
              console.log(name, directory.path, os.EOL, err.message);
              return EMPTY;
            }),
            filter((document) => document !== directory.content),
            tap((template) => {
              fs.writeFileSync(directory.path, template);
            }),
            map(() => directory.path)
          );
      }),
    );
