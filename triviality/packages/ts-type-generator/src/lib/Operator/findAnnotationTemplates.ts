import {match} from "ramda";
import {mergeMap, map} from "rxjs/Operators";
import {of} from "rxjs";
import {stripDocBlock} from "../Functions/stripDocBlock";

/**
 * Return all generators of a single document.
 *
 * Generators need to be inside multi-doc block comment. (/* * /)
 */
export const findAnnotationTemplates = (annotationName: string) => mergeMap((content: string) =>
  of(match(new RegExp(`^.*@${annotationName}\\([\\s\\S.*]*?\\).*[.\\s\\S]*?\\*\\/$`, 'gm'), content))
    .pipe(
      mergeMap((templates) => templates),
      map(stripDocBlock),
      map((template) => {
        const start = content.indexOf(template);
        const end = start + template.length;
        const dockBlockStart = content.slice(0, start).lastIndexOf('/*');
        const dockBlockEnd = end + content.slice(end).indexOf('*/') + 2;
        const dockBlock = content.slice(dockBlockStart, dockBlockEnd);
        const indentation = /^( *)\*/m.exec(dockBlock)![1].length;
        return {
          template,
          dockBlock,
          indentation,
        };
      })
    )
);
