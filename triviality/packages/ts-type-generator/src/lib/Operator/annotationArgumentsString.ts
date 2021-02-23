import {mergeMap} from "rxjs/Operators";
import {throwError} from "rxjs";
import {match} from "ramda";

export const annotationArgumentsString = (annotationName: string) => mergeMap((annotationTemplate: string) => {
  const regex = `@${annotationName}\\(([\\s\\S.]*)\\)`;
  const result = match(new RegExp(regex), annotationTemplate);
  if (result.length === 0) {
    return throwError(`No matches found for regex:\n${regex}\nin annotationTemplate:\n${annotationTemplate}`);
  }
  return [result[1]];
});
