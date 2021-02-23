import {of} from 'rxjs';
import {toArray} from 'rxjs/Operators';
import {parseAnnotationArguments} from "../parseAnnotationArguments";
import * as joi from "joi";

interface ExampleTemplate {
  foo: string;
}

export const ExampleTemplateSchema = joi.object<ExampleTemplate>({
  foo: joi.string().required(),
});

it('parseAnnotationArguments', async () => {
  expect(
    await
      of("@ExampleGenerator({ foo: \"hi\" })")
        .pipe(
          parseAnnotationArguments(ExampleTemplateSchema, 'ExampleGenerator')
        ).toPromise()
  ).toEqual({
    foo: "hi"
  } as ExampleTemplate);
});
