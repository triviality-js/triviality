import {always, applySpec, cond, identity, is, match, nth, pipe, T} from "ramda";
import {GeneratorTag} from "../DTO/GeneratorTag";
import * as R from "ramda";


/**
 * Find all tags  "{t%: K%}" of a function template.
 */
export const findGeneratorTagsStrings: (template: string) => string[] = match(/{{.+?}}/gm);



/**
 * Parse a single tag and return variables.
 */
export const parseGeneratorTag: (tag: string) => GeneratorTag =
  pipe(
    match(/{{(.*?) *(-(.*))?}}/),
    applySpec<GeneratorTag>({
      tag: nth(0),
      template: nth(1),
      separator: pipe(nth(3) as unknown as () => string, cond([
        [is(String), identity],
        [T, always(', ')],
      ])),
    }),
  );

export const findGeneratorTags: (template: string) => GeneratorTag[] = pipe(findGeneratorTagsStrings, R.map(parseGeneratorTag));
