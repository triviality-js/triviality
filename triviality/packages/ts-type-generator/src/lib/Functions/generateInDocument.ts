import {create} from 'filehound';
import * as fs from 'fs';
import {EOL} from 'os';
import * as joi from 'joi';
import {map, mergeMap, pluck, tap, toArray} from 'rxjs/Operators';
import {findAnnotationTemplates, parseAnnotationArguments} from "../Operator";
import {filesInDirectory} from "../Observable";
import {of, OperatorFunction} from "rxjs";
import {Schema} from "joi";
import * as os from "os";
import {filter} from "rxjs/Operators";
import {findTextToRemove, matchEmptyOrStatement} from "./findTextToRemove";
import {indent} from "./indent";
import {replaceAll} from "./replaceAll";

export interface BaseOptions {
  removeNextLines: RegExp;
}

export const BaseSchema = joi.object<BaseOptions>({
  removeNextLines: joi.function().default(matchEmptyOrStatement),
});

export const generateInDocument = <T extends BaseOptions>(name: string, schema: Schema<T>, generate: (options: T) => string) => mergeMap(
  (document: string) => of(document).pipe(
    findAnnotationTemplates(name),
    mergeMap(({dockBlock, template, indentation}) =>
      of(template)
        .pipe(
          parseAnnotationArguments(schema, name),
          mergeMap((options) => {
            const generated = generate(options);
            const endIndex = document.indexOf(dockBlock) + dockBlock.length;
            const toRemove = findTextToRemove(document.slice(endIndex), options.removeNextLines);
            const target = dockBlock + toRemove;
            const replacement = dockBlock + os.EOL + indent(generated, indentation);
            return [{
              options,
              generated,
              target,
              replacement,
              template,
              dockBlock,
            }];
          }),
        )
    ),
    toArray(),
    replaceAll(document),
  ));

