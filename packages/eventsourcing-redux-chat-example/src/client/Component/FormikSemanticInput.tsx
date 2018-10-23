import { Input, InputProps, Label, FormField } from 'semantic-ui-react';
import * as _ from 'lodash';
import React from 'react';


const DisplayError = (error: string | undefined, touched: boolean | undefined) => {
  if (!error || !touched) {
    return null;
  }
  return (
    <Label active={!!error} basic color='red' pointing="above">
      {error}
    </Label>
  );
};

export const FormikSemanticInput = (props: InputProps & {
  name: string,
  values: { [key: string]: any },
  errors: { [key: string]: string | undefined },
  touched: { [key: string]: boolean | undefined }
}) => {
  const name: string = props.name;
  const error: string | undefined = props.errors[name];
  return (
    <FormField>
      <Input
        fluid
        iconPosition='left'
        labelPosition="right"
        {..._.omit(props, ['values', 'touched', 'errors'])}
        value={props.values[name]}
        error={!!error}
      />
      {DisplayError(error, props.touched[name])}
    </FormField>
  );
};
