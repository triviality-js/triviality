import {create} from 'filehound';
import * as fs from 'fs';
import {EOL} from 'os';
import * as joi from 'joi';
import {map, mergeMap, pluck, tap, toArray} from 'rxjs/Operators';
import {findAnnotationTemplates, parseAnnotationArguments} from "./Operator";
import {filesInDirectory} from "./Observable";
import {
  generateTemplates,
  matchEmptyOrStatement,
  findTextToRemove,
  stripDocBlock,
  replaceAll,
  generateInDirectory, BaseSchema, BaseOptions, generateInDocument
} from "./Functions";
import {of, OperatorFunction} from "rxjs";
import {Schema} from "joi";
import * as os from "os";
import {filter} from "rxjs/Operators";

export interface TypeGenerator extends BaseOptions {
  length: number;
  empty: boolean;
  templates: string[];
}

export const TypeTemplateSchema = BaseSchema.append<TypeGenerator>({
  length: joi.number().positive().default(10),
  templates: joi.array().has(joi.string().required()).required(),
  empty: joi.boolean().default(false),
});

export const generateType = (options: TypeGenerator): string => generateTemplates(options.length, options.empty, options.templates);

export const generateTypesInDocument = generateInDocument<TypeGenerator>('typeGenerator', TypeTemplateSchema, generateType);
export const generateTypesInDirectory = generateInDirectory('typeGenerator', generateTypesInDocument);
