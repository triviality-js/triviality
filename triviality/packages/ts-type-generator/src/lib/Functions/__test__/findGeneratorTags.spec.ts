import { of } from 'rxjs';
import { toArray } from 'rxjs/Operators';
import {findGeneratorTags, findGeneratorTagsStrings, parseGeneratorTag} from "../findGeneratorTags";
import {GeneratorTag} from "../../DTO";

it('findGeneratorTagsStrings', () => {
  expect(
    findGeneratorTagsStrings(
      'export function toInt({{a%i: number}}): { data: {{a%i}} };'
    )
  ).toEqual(['{{a%i: number}}', '{{a%i}}']);
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
  expect(
    findGeneratorTags('foobar({{a%: number}}): { data: [{{typeof a%}}] };')
  ).toEqual([
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
