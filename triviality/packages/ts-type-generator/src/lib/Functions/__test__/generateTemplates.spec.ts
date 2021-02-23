import { of } from 'rxjs';
import { toArray } from 'rxjs/Operators';
import {generateTemplate, generateTemplates} from "../generateTemplates";

it('generateTemplate', () => {
  expect(
    generateTemplate('foobar({{a%: number}}): { data: [{{typeof a%}}] };', 2)
  ).toEqual(
    'foobar(a1: number, a2: number): { data: [typeof a1, typeof a2] };'
  );
});

it('generateTemplates', () => {
  expect(
    generateTemplates(2, false, [
      'foo({{a%: string}}): void;',
      'bar({{b%:number}}): void;',
    ])
  ).toEqual(
    `foo(a1: string): void;
bar(b1:number): void;
foo(a1: string, a2: string): void;
bar(b1:number, b2:number): void;`
  );
});

it('generateTemplates with empty function', () => {
  expect(
    generateTemplates(2, true, [
      'foo({{a%: string}}): void;',
      'bar({{b%:number}}): void;',
    ])
  ).toEqual(
    `foo(): void;
bar(): void;
foo(a1: string): void;
bar(b1:number): void;
foo(a1: string, a2: string): void;
bar(b1:number, b2:number): void;`
  );
});

it('generateTemplates should remove empty generic types <>', () => {
  expect(
    generateTemplates(1, true, [
      'foo<{{A% extends string}}>({{a%: A1}}): void;',
    ])
  ).toEqual(
    `foo(): void;
foo<A1 extends string>(a1: A1): void;`
  );
  expect(
    generateTemplates(1, true, [
      'foo<{{A% extends string}}, D extends number>({{a%: A1}}, d: D): void;',
    ])
  ).toEqual(
    `foo<D extends number>(d: D): void;
foo<A1 extends string, D extends number>(a1: A1, d: D): void;`
  );
  expect(
    generateTemplates(1, true, [
      'foo<C extends Object,{{ A% extends string}}, D extends number>({{a%: A1}}, d: D, c: C): void;',
    ])
  ).toEqual(
    `foo<C extends Object, D extends number>(d: D, c: C): void;
foo<C extends Object, A1 extends string, D extends number>(a1: A1, d: D, c: C): void;`
  );
});
