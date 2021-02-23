import {replace} from "ramda";

/**
 * Remove all ,< from empty generic functions.
 *
 * This:
 * <>
 * <,C extends string>
 * <, ,C extends string>
 * <D extends number,, C extends string>
 * <D extends number,, C extends string>(,dd: string)
 * <D extends number,, C extends string>(dd: string,,d: string)
 *
 * Would be this:
 * <C extends string>
 * <C extends string>
 * <D extends number, C extends string>
 * <D extends number, C extends string>(dd: string)
 * <D extends number, C extends string>(dd: string,d: string)
 */
export const stripEmptyGeneric = (value: string) => {
  const replaced = replace(/<>|([<(]), *|( *, *),|, *(\))/gm, '$1$2$3')(value);
  return replaced.replace(/(<)(, *)*/gm, '$1')
};

