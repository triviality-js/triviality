import {__, always, applySpec, cond, curry, curryN, identity, is, match, nth, pipe, range, replace, T} from "ramda";
import * as joi from "joi";
import * as R from "ramda";
import {EOL} from "os";
import {stripEmptyGeneric} from "./stripEmptyGeneric";
import {generateRecurringString} from "./generateRecurringString";
import {GeneratorTag} from "../DTO";
import {findGeneratorTags} from "./findGeneratorTags";
import {populateGeneratorTagTemplate} from "./populateGeneratorTagTemplate";
import {CurryPositions} from "../CurryPositions";

export const generateTemplate = (template: string, length: number, binary: CurryPositions | null = null): string => {
  const g = generateRecurringString(length, false);
  const result = findGeneratorTags(template).reduce(
    (acc, {tag, separator, template: t}) => {
      const f: string = g(populateGeneratorTagTemplate(t, binary), separator);
      return acc.replace(tag, f);
    },
    template,
  );
  return stripEmptyGeneric(populateGeneratorTagTemplate(result)(length));
};

export function generateTemplates(length: number, emptyArgs: boolean, templates: string[]): string {
  return generateRecurringString(
    length,
    emptyArgs,
    (i) => {
      return templates.reduce<string | null>(
        (acc, template) => {
          if (!acc) {
            return generateTemplate(template, i);
          }
          return acc + EOL + generateTemplate(template, i);
        },
        null,
      ) || '';
    },
    EOL,
  );
}

