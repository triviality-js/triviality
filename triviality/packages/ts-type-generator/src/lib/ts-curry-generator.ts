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
  generateInDirectory, createCurryPositions, generateFunctionByBinary, generateFunctionFixed
} from "./Functions";
import os from "os";
import {} from "./Functions/generateInDocument";
import {curry, curryN, map} from "ramda";
import {generateTypesInDocument} from "./ts-type-generator";
import { range } from 'lodash';

export interface CurryOptions extends BaseOptions{
  length: number;
  maxCurry: number;
  argTemplate: string;
  resultTemplate: string;
  curryResultTemplate: string;
  functionTemplate: string;
}

export const CurryTemplateSchema = BaseSchema.append<CurryOptions>({
  length: joi.number().positive().default(10),
  maxCurry: joi.number().positive().default(10),
  argTemplate: joi.string().required(),
  resultTemplate: joi.string().required(),
  curryResultTemplate: joi.string().required(),
  functionTemplate: joi.string().default(''),
});

export function generateFunction(length: number, template: CurryOptions): string {
  const binaryCombinations = createCurryPositions(length, template.maxCurry);
  const functions: string[] = map(generateFunctionByBinary(length, template), binaryCombinations);
  return indent(functions.join(''));
}

function generate(template: CurryOptions): string {
  return generateRecurringString(
    template.length,
    false,
    (i) => {
      return generateFunction(i, template);
    }
    ,
    EOL,
  );
}

export const generateCurryInDocument = generateInDocument<CurryOptions>('curryGenerator', CurryTemplateSchema, generate);
export const generateCurryInDirectory = generateInDirectory('curryGenerator', generateCurryInDocument);
