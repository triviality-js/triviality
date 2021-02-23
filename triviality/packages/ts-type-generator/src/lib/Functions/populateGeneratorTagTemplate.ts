import {curry, replace, trim} from "ramda";


/**
 * Fill tag template.
 * - Replaces % for i given.
 * - Strip template tokens.
 *
 * Tag can have multiple templates,
 *  d%: KSF<T, D%>  d%: __
 *
 */
export const populateGeneratorTagTemplate = (template: string, binary: number | null = 0) => (i: number) => {
  const templates: string[] = template.indexOf('[') === 0 ? JSON.parse(template) : [template];
  if (templates.length === 1 || binary === null) {
    return replace(/%/g, i.toString(10), templates[0]);
  }
  if (binary & 1 << (i - 1)) {
    return replace(/%/g, i.toString(10), templates[1]);
  }
  return replace(/%/g, i.toString(10), templates[0]);
};
