import { create } from 'filehound';
import * as fs from 'fs';
import { EOL } from 'os';
import {
  __,
  always,
  applySpec,
  cond,
  curry,
  curryN,
  identity,
  is,
  map,
  match,
  nth,
  pipe,
  range,
  replace,
  T,
} from 'ramda';
import * as yup from 'yup';

export const generateRecurringString =
  curry((total: number, empty: boolean, createString: (nr: number) => string, separator: string) => range(empty ? 0 : 1, total + 1).map(createString).join(separator));

export const parseNumber: (str: string) => number = curryN(2, parseInt)(__, 10);

/**
 * Return all generators of a single document.
 *
 * Generators need to be inside multi-doc block comment.
 */
export const findAnnotationsString: (annotation: string) => (document: string) => string[] = (annotation: string) => match(new RegExp(`^.*@${annotation}\\([\\s\\S.*]*?\\).*[.\\s\\S]*?\\*\\/$`, 'gm'));

/**
 * Return all generators of a single document.
 *
 * Generators need to be inside multi-doc block comment.
 */
export const findFunctionGeneratorAnnotationsString: (document: string) => string[] = findAnnotationsString('typeGenerator');

interface GeneratorTemplate {
  length: number;
  empty: boolean;
  templates: string[];
  removeNextLines: RegExp;
}

const matchEmptyOrStatement = () => /(.*; *$|^ *$)/;
const GeneratorTemplateSchema = yup.object({
  length: yup.number().positive().default(10),
  templates: yup.array(yup.string().required()).required(),
  removeNextLines: yup.mixed().default(matchEmptyOrStatement),
  empty: yup.boolean().default(false),
}).noUnknown();

/**
 * Remove any doc block characters from a string
 *
 * //
 *
 * /**
 *  *
 *  * /
 */
export const stripDocBlock = replace(/^ *(\/?\*+|\/\/)/gm, '');

/**
 * Remove all ,< from empty generic functions.
 *
 * This:
 * <>
 * <,C extends string>
 * <D extends number,, C extends string>
 * <D extends number,, C extends string>(,dd: string)
 * <D extends number,, C extends string>(dd: string,,d: string)
 *
 * Would be this:
 * <C extends string>
 * <D extends number, C extends string>
 * <D extends number, C extends string>(dd: string)
 * <D extends number, C extends string>(dd: string,d: string)
 */
const stripEmptyGeneric = replace(/<>|(<|\(), *|( *, *),|, *(\))/gm, '$1$2$3');

/**
 * Parse generator function.
 *
 * @typeGenerator({ length: 10, templates: ["services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];"], removeNextLines: /; *$/ })
 */
export const parseFunctionGeneratorAnnotation: (template: string) => GeneratorTemplate = pipe(
  match(/@typeGenerator\(([\s\S.]*)\)/),
  pipe(nth(1) as any, (target: string) => {
    const striped = stripDocBlock(target);
    try {
      // tslint:disable-next-line:no-eval
      return eval(`(${striped});`);
    } catch (e) {
      throw new Error(`${e} => (${striped});`);
    }
  }),
  GeneratorTemplateSchema.cast.bind(GeneratorTemplateSchema) as any,
);

/**
 * Find all tags  "{t%: K%}" of a function template.
 */
export const findGeneratorTagsStrings: (template: string) => string[] = match(/{{.+?}}/gm);

interface GeneratorTag {
  tag: string;
  template: string;
  separator: string;
}

/**
 * Parse a single tag and return variables.
 */
export const parseGeneratorTag: (tag: string) => GeneratorTag =
  pipe(
    match(/{{(.*?) *(-(.*))?}}/),
    applySpec<GeneratorTag>({
      tag: nth(0),
      template: nth(1),
      separator: pipe(nth(3) as any, cond([
        [is(String), identity],
        [T, always(', ')],
      ])),
    }),
  );

export const findGeneratorTags: (template: string) => GeneratorTag[] = pipe(findGeneratorTagsStrings, map(parseGeneratorTag));

/**
 * Fill tag template.
 * - Replaces % for i given.
 * - Strip template tokens.
 */
const populateGeneratorTagTemplate = curry((template: string, i: number) => replace(/%/g, i.toString(10), template));

export const generateFunction = curry((template: string, i: number): string => {
  const g = generateRecurringString(i, false);
  const result = findGeneratorTags(template).reduce(
    (acc, { tag, separator, template: t }) => {
      const f: string = g(populateGeneratorTagTemplate(t), separator);
      return acc.replace(tag, f);
    },
    template,
  );
  return i === 0 ? stripEmptyGeneric(result) : result;
});

export function generateFunctions(length: number, emptyArgs: boolean, templates: string[]): string {
  return generateRecurringString(
    length,
    emptyArgs,
    (i) => {
      return templates.reduce<string | null>(
        (acc, template) => {
          if (!acc) {
            return generateFunction(template, i);
          }
          return acc + EOL + generateFunction(template, i);
        },
        null,
      ) || '';
    },
    EOL,
  );
}

function removeStartLine(text: string, removeNextLines: RegExp) {
  return match(/^.*$/gm, text)
    .reduce<{ document: string, done: boolean }>(
      ({ document, done }, line) => {
        if (done || !removeNextLines.test(line)) {
          return {
            document: document === '' ? line : document + EOL + line,
            done: true,
          };
        }
        return {
          document,
          done,
        };
      },
      { document: '', done: false },
    ).document;
}

export function generateFunctionsInDocument(document: string) {
  return findFunctionGeneratorAnnotationsString(document)
    .reduce(
      (acc: string, generator) => {
        const { templates, length, removeNextLines, empty } = parseFunctionGeneratorAnnotation(generator);
        const index = acc.indexOf(generator);
        const end = index + generator.length;

        const cleaned = acc.slice(0, end) + EOL + removeStartLine(acc.slice(end), removeNextLines);

        return cleaned.replace(generator, generator + EOL + generateFunctions(length, empty, templates));
      },
      document,
    );
}

/**
 * Replaces multiple generators of set of files.
 */
export function generateFunctionsOfTemplatesInDirectory(...directories: string[]) {
  create()
    .paths(...directories)
    .ext(['ts', 'tsx'])
    .discard(/__test__/ as any)
    .findSync()
    .forEach((file) => {
      const content = fs.readFileSync(file).toString();
      const updates = generateFunctionsInDocument(content);
      if (content !== updates) {
        fs.writeFileSync(file, updates);
      }
    });
}

it('generateRecurringString should generate string based on length and template', () => {
  const g = generateRecurringString(3, false);
  expect(g((i) => `[${i}]`, ', ')).toEqual('[1], [2], [3]');

  const gE = generateRecurringString(3, true);
  expect(gE((i) => `[${i}]`, ', ')).toEqual('[0], [1], [2], [3]');
});

it('parseNumber', () => {
  expect(parseNumber('10')).toEqual(10);
  expect(parseNumber('-10')).toEqual(-10);
});

it('findFunctionGeneratorAnnotationsString', () => {
  expect(findFunctionGeneratorAnnotationsString(
    `
  /**
   * @typeGenerator({ length: 10, templates: ["services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];"] })
   */
   export function servives(tags: any): any[];

  /**
   * @typeGenerator({ length: 10, templates: ["export function toInt({a%i: number}): void;"], removeNextLines: /;/})
   */
   export toInt(...args: number[]): void;
  `,
  )).toMatchSnapshot();
});

it('findFunctionGeneratorAnnotationsString multiline', () => {
  expect(findFunctionGeneratorAnnotationsString(
    `
  /**
   * @typeGenerator({ length: 10, templates:
   * ["services<{K% extends keyof T}>({t%: K%}): [{T[K%]}];"]
   * } )
   */
 `,
  )).toMatchSnapshot();
});

it('parseFunctionGeneratorAnnotation', () => {
  expect(parseFunctionGeneratorAnnotation('@typeGenerator({ empty: true, length: 10, templates: [\'export function toInt({a%i: number}): void;\'], removeNextLines: /;/ })')).toEqual({
    empty: true,
    length: 10,
    removeNextLines: /;/,
    templates: ['export function toInt({a%i: number}): void;'],
  } as GeneratorTemplate);
});

it('parseFunctionGeneratorAnnotation with defaults', () => {
  expect(parseFunctionGeneratorAnnotation('@typeGenerator({ length: 5, templates: [\'export function toInt({a%i: number}): void;\'] })')).toEqual({
    empty: false,
    length: 5,
    removeNextLines: /(.*; *$|^ *$)/,
    templates: ['export function toInt({a%i: number}): void;'],
  } as GeneratorTemplate);
});

it('findGeneratorTagsStrings', () => {
  expect(findGeneratorTagsStrings('export function toInt({{a%i: number}}): { data: {{a%i}} };')).toEqual([
    '{{a%i: number}}',
    '{{a%i}}',
  ]);
});

it('parseGeneratorTag', () => {
  expect(parseGeneratorTag('{{a%}}')).toEqual({
    template: 'a%',
    separator: ', ',
    tag: '{{a%}}',
  } as GeneratorTag);

  expect(parseGeneratorTag('{{b%- | }}')).toEqual({
    template: 'b%',
    separator: ' | ',
    tag: '{{b%- | }}',
  } as GeneratorTag);
});

it('findGeneratorTags', () => {
  expect(findGeneratorTags('foobar({{a%: number}}): { data: [{{typeof a%}}] };')).toEqual([
    {
      template: 'a%: number',
      separator: ', ',
      tag: '{{a%: number}}',
    },
    {
      template: 'typeof a%',
      separator: ', ',
      tag: '{{typeof a%}}',
    },
  ] as GeneratorTag[]);
});

it('populateGeneratorTagTemplate', () => {
  expect(populateGeneratorTagTemplate('a%: number', 2)).toEqual('a2: number');
  expect(populateGeneratorTagTemplate('c: typeof a%, a%: number', 5)).toEqual('c: typeof a5, a5: number');
});

it('generateFunction', () => {
  expect(generateFunction('foobar({{a%: number}}): { data: [{{typeof a%}}] };', 2)).toEqual('foobar(a1: number, a2: number): { data: [typeof a1, typeof a2] };');
});

it('generateFunctions', () => {
  expect(generateFunctions(2, false, ['foo({{a%: string}}): void;', 'bar({{b%:number}}): void;']))
    .toEqual(
      `foo(a1: string): void;
bar(b1:number): void;
foo(a1: string, a2: string): void;
bar(b1:number, b2:number): void;`);
});

it('generateFunctions with empty function', () => {
  expect(generateFunctions(2, true, ['foo({{a%: string}}): void;', 'bar({{b%:number}}): void;']))
    .toEqual(
      `foo(): void;
bar(): void;
foo(a1: string): void;
bar(b1:number): void;
foo(a1: string, a2: string): void;
bar(b1:number, b2:number): void;`);
});

it('generateFunctions should remove empty generic types <>', () => {
  expect(generateFunctions(1, true, ['foo<{{A% extends string}}>({{a%: A1}}): void;']))
    .toEqual(
      `foo(): void;
foo<A1 extends string>(a1: A1): void;`);
  expect(generateFunctions(1, true, ['foo<{{A% extends string}}, D extends number>({{a%: A1}}, d: D): void;']))
    .toEqual(
      `foo<D extends number>(d: D): void;
foo<A1 extends string, D extends number>(a1: A1, d: D): void;`);
  expect(generateFunctions(1, true, ['foo<C extends Object,{{ A% extends string}}, D extends number>({{a%: A1}}, d: D, c: C): void;']))
    .toEqual(
      `foo<C extends Object, D extends number>(d: D, c: C): void;
foo<C extends Object, A1 extends string, D extends number>(a1: A1, d: D, c: C): void;`);
});

it('generateFunctionsInDocument', () => {
  expect(generateFunctionsInDocument(`
/**
 * @typeGenerator({ length: 4, templates: ["compose<{{t% extends keyof T}}}, F extends ({{d%: SFT<T[t%]>}}) => S, S>(f: F, {{k%: t%}}}): () => S;"] })
 */
`))
    .toEqual(
      `
/**
 * @typeGenerator({ length: 4, templates: ["compose<{{t% extends keyof T}}}, F extends ({{d%: SFT<T[t%]>}}) => S, S>(f: F, {{k%: t%}}}): () => S;"] })
 */
compose<t1 extends keyof T}, F extends (d1: SFT<T[t1]>) => S, S>(f: F, k1: t1}): () => S;
compose<t1 extends keyof T, t2 extends keyof T}, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>) => S, S>(f: F, k1: t1, k2: t2}): () => S;
compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T}, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3}): () => S;
compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T}, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4}): () => S;
`);
});

it('generateFunctionsInDocument multiline', () => {
  expect(generateFunctionsInDocument(`
/**
 * @typeGenerator({ length: 2, templates: [
 *   "Foo{{%}}",
 *   "Bar{{%}}",
 *  ]})
 */
`))
    .toEqual(
      `
/**
 * @typeGenerator({ length: 2, templates: [
 *   "Foo{{%}}",
 *   "Bar{{%}}",
 *  ]})
 */
Foo1
Bar1
Foo1, 2
Bar1, 2
`);
});

it('removeStartLine', () => {

  expect(removeStartLine(
    `d;
ddsad;

sad;;

Do not remove!

Don't ignore this;
`,
    matchEmptyOrStatement(),
  )).toEqual(`Do not remove!

Don't ignore this;
`);

});

it('generateFunctionsInDocument should remove old lines', () => {
  expect(generateFunctionsInDocument(`
/**
 * @typeGenerator({ length: 4, templates: ["compose<{{t% extends keyof T}}}, F extends ({{d%: SFT<T[t%]>}}) => S, S>(f: F, {{k%: t%}}}): () => S;"] })
 */
 compose<t1 extends keyof T, t2 extends keyof T}, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>) => S, S>(f: F, k1: t1, k2: t2}): () => S;
Remove this;
compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T}, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4}): () => S;

preserve this

`))
    .toEqual(
      `
/**
 * @typeGenerator({ length: 4, templates: ["compose<{{t% extends keyof T}}}, F extends ({{d%: SFT<T[t%]>}}) => S, S>(f: F, {{k%: t%}}}): () => S;"] })
 */
compose<t1 extends keyof T}, F extends (d1: SFT<T[t1]>) => S, S>(f: F, k1: t1}): () => S;
compose<t1 extends keyof T, t2 extends keyof T}, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>) => S, S>(f: F, k1: t1, k2: t2}): () => S;
compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T}, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3}): () => S;
compose<t1 extends keyof T, t2 extends keyof T, t3 extends keyof T, t4 extends keyof T}, F extends (d1: SFT<T[t1]>, d2: SFT<T[t2]>, d3: SFT<T[t3]>, d4: SFT<T[t4]>) => S, S>(f: F, k1: t1, k2: t2, k3: t3, k4: t4}): () => S;
preserve this

`);
});

it('!!', () => {
  generateFunctionsOfTemplatesInDirectory(`${__dirname}/../../`);
});
