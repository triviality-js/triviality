import {curryN} from "ramda";
import {generateTemplate} from "./generateTemplates";
import {generateFunctionFixed} from "./generateFunctionFixed";
import {curryIndexes} from "./countCurry";
import {CurryPositions} from "../CurryPositions";

export const generateFunctionByBinary = curryN(3, (length: number, template: {
  argTemplate: string;
  resultTemplate: string;
  curryResultTemplate: string;
  functionTemplate: string;
}, binary: CurryPositions) => {
  const args: string = generateTemplate(template.argTemplate, length, binary);
  const argsLeft: number[] = curryIndexes(length, binary);
  if (argsLeft.length === 0) {
    return `${generateTemplate(template.functionTemplate, length)}(${args}): ${generateTemplate(template.resultTemplate, length)}\n\n`;
  }
  return `${generateTemplate(template.functionTemplate, length)}(${args}): ${generateFunctionFixed(template.curryResultTemplate, argsLeft)}\n\n`;
});
