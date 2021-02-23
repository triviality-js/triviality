import {Schema} from "joi";
import {stripDocBlock} from "../Functions";
import {map, mergeMap} from "rxjs/Operators";
import {of} from "rxjs";
import {annotationArgumentsString} from "./annotationArgumentsString";

/**
 * Parse generator function.
 *
 * @typeGenerator({ length: 10, templates: ["services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];"], removeNextLines: /; *$/ })
 */
export const parseAnnotationArguments = <T>(schema: Schema<T>, annotationName: string) =>
  mergeMap(
    (document: string) => of(document)
      .pipe(
        annotationArgumentsString(annotationName),
        map((annotationArguments) => {
          const code = `(${annotationArguments});`;
          try {
            return schema.validate(eval(code)).value as T;
          } catch (e) {
              throw new Error(`Annotation arguments are corrupt for ${annotationName}:\n${code}\n${e}`)
          }
        })
      )
  )
