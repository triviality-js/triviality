import {map} from "rxjs/Operators";


export const replaceAll = (document: string) => map((replacements: { target: string, replacement: string }[]) =>
  replacements.reduce((acc, replacement) =>
    acc.replace(replacement.target, replacement.replacement), document))
