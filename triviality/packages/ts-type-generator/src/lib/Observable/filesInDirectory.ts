import {Observable, of} from "rxjs";
import {mergeMap} from "rxjs/Operators";
import {create} from "filehound";
import fs from "fs";
import {FileContent} from "../DTO/FileContent";
import {promisify} from "util";

export const filesInDirectory: (directories: string[], discard?: string[]) => Observable<FileContent> = (directories, discard: string[] = ['__test__', '\\.spec\\.ts(x?)', 'ts-type-generator']) =>
  of(...create()
    .paths(...directories)
    .ext(['ts', 'tsx'])
    .discard(discard)
    .findSync()
  ).pipe(mergeMap(async (file): Promise<FileContent> => ({
      path: file,
      content: (await promisify(fs.readFile)(file)).toString()
    })
  ))
;
