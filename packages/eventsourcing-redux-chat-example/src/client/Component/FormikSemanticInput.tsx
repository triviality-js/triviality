import { Input, InputProps, Label, FormField } from 'semantic-ui-react';
import * as _ from 'lodash';
import React from 'react';
import { FormikProps } from "formik";


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

export function FormikSemanticInput(props: InputProps & { name: string, formikProps: FormikProps<any> }) {
  const name = props.name;
  const error: string = props.formikProps.errors[name] as any;
  const formikProps = props.formikProps;
  return (
    <FormField>
      <Input
        fluid
        iconPosition='left'
        labelPosition="right"
        name={name}
        onChange={formikProps.handleChange}
        value={formikProps.values[name]}
        error={!!error}
        {..._.omit(props, ['formikProps'])}
      />
      {DisplayError(error, !!props.formikProps.touched[name])}
    </FormField>
  );
};
