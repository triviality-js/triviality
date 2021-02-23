import {of, OperatorFunction} from "rxjs";
import {filesInDirectory} from "../Observable";
import {filter, map, mergeMap, tap} from "rxjs/Operators";
import fs from "fs";

/**
 * Replaces multiple generators of set of files.
 */
export const generateInDirectory = (name: string, generateDocument: OperatorFunction<string, string>) => (directories: string[], discard?: string[]) =>
  filesInDirectory(directories, discard)
    .pipe(
      mergeMap((directory) =>
        of(directory.content)
          .pipe(
            filter((document) => document.includes(name)),
            generateDocument,
            filter((document) => document !== directory.content),
            tap((template) => {
              fs.writeFileSync(directory.path, template);
            }),
            map(() => directory.path)
          )),
    );
