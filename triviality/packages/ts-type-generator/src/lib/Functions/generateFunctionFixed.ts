import {curry, map} from "ramda";
import {findGeneratorTags} from "./findGeneratorTags";
import {populateGeneratorTagTemplate} from "./populateGeneratorTagTemplate";
import {stripEmptyGeneric} from "./stripEmptyGeneric";

export const generateFunctionFixed = curry((template: string, numbers: number[]): string => {
  const result = findGeneratorTags(template).reduce(
    (acc, {tag, separator, template: t}) => {
      const generated: string = map(populateGeneratorTagTemplate(t), numbers).join(', ');
      return acc.replace(tag, generated);
    },
    template,
  );
  return stripEmptyGeneric(populateGeneratorTagTemplate(result)(numbers.length));
});
