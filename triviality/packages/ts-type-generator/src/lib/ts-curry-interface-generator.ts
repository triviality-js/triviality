import {create} from 'filehound';
import * as fs from 'fs';
import {EOL} from 'os';
import * as joi from 'joi';
import {mergeMap, toArray} from "rxjs/Operators";
import {of} from "rxjs";
import {findAnnotationTemplates, parseAnnotationArguments} from "./Operator";
import {
  BaseOptions,
  BaseSchema,
  generateInDocument,
  findTextToRemove,
  generateTemplates,
  indent,
  replaceAll,
  stripEmptyGeneric,
  findGeneratorTags,
  populateGeneratorTagTemplate,
  generateTemplate,
  generateRecurringString,
  generateInDirectory, createCurryPositions
} from "./Functions";
import os from "os";
import {curry, curryN, map} from "ramda";
import {generateTypesInDocument} from "./ts-type-generator";
import {CurryOptions, CurryTemplateSchema, generateFunction} from "./ts-curry-generator";

export interface CurryInterfaceOptions extends CurryOptions {
  interfaceTemplate: string;
}

const CurryInterfaceSchema = CurryTemplateSchema.append<CurryInterfaceOptions>({
  interfaceTemplate: joi.string().required(),
});

export function generateInterface(template: CurryInterfaceOptions): string {
  return generateRecurringString(
    template.length,
    false,
    (i) => {
      return `
${generateTemplate(template.interfaceTemplate, i)} {
${generateFunction(i, template)}
}
      `;
    },
    EOL,
  );
}

export const generateCurryInterfaceInDocument = generateInDocument<CurryInterfaceOptions>('curryInterfaceGenerator', CurryInterfaceSchema, generateInterface);
export const generateCurryInterfaceInDirectory = generateInDirectory('curryInterfaceGenerator', generateCurryInterfaceInDocument);
