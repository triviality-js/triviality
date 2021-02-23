import {Observable, of, from} from "rxjs";
import {map} from "rxjs/Operators";
import {FileContent} from "../DTO/FileContent";

export const filesInMemory: (...content: string[]) => Observable<FileContent> = (...content) =>
  from(content)
    .pipe(map((file) => ({content: file, path: '/tmp'})));
