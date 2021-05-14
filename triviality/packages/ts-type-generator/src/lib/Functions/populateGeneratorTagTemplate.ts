import {curry, replace, trim} from "ramda";
import {isAtTheEnd} from "./countCurry";
import {CurryPositions} from "../CurryPositions";


/**
 * Fill tag template.
 * - Replaces % for i given.
 * - Strip template tokens.
 *
 * Tag can have multiple templates,
 *  d%: KSF<T, D%>  d%: __
 *
 */
export const populateGeneratorTagTemplate = (template: string, binary: CurryPositions | null = null) => (i: number) => {
  try {
    const templates: string[] = template.indexOf('[') === 0 ? JSON.parse(template) : [template];
    if (templates.length === 1 || binary === null) {
      return replace(/%/g, i.toString(10), templates[0]);
    }
    if (binary.atPos(i)) {
      if (isAtTheEnd(binary, i) && templates.length >= 3) {
        return replace(/%/g, i.toString(10), templates[2]);
      }
      return replace(/%/g, i.toString(10), templates[1]);
    }
    return replace(/%/g, i.toString(10), templates[0]);
  } catch (e) {
    console.error("Invalid JSON", template);
    throw e;
  }
};
