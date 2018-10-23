import React from 'react'
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Assert } from '../../../shared/Assert';
import { FormikSemanticInput } from '../../Component/FormikSemanticInput';

const RegisterSchema = Yup.object().shape({
  name: Assert.userName,
  password: Assert.password,
  passwordConfirm: Yup.string()
                      .oneOf([Yup.ref('password')], 'Confirm password should equals password'),
});

const RegisterForm = ({ register }: { register: (name: string, password: string) => Promise<void> }) => (
  <div className='login-form'>
    <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' textAlign='center'>
          Register your account
        </Header>
        <Formik
          initialValues={{ password: '', passwordConfirm: '', email: '', name: '' }}
          validationSchema={RegisterSchema}
          onSubmit={async (data, {resetForm, setSubmitting, setStatus}) => {
            try {
              await register(data.name, data.password);
              resetForm();
            } catch (e) {
              setStatus(e);
              setSubmitting(false);
            }
          }}
          render={({ status, values, errors, touched, handleChange, handleSubmit, isSubmitting }) => {
            return (
              <Form size='large' onSubmit={handleSubmit}>
                <Segment stacked>
                  <FormikSemanticInput
                    icon='user'
                    placeholder='Name'
                    name='name'
                    onChange={handleChange}
                    errors={errors}
                    values={values}
                    touched={touched}
                  />
                  <FormikSemanticInput
                    icon='lock'
                    placeholder='Password'
                    type='password'
                    name='password'
                    onChange={handleChange}
                    errors={errors}
                    values={values}
                    touched={touched}
                  />
                  <FormikSemanticInput
                    icon='lock'
                    placeholder='Confirm password'
                    type='password'
                    name='passwordConfirm'
                    onChange={handleChange}
                    errors={errors}
                    values={values}
                    touched={touched}
                  />
                  <Button type='submit' fluid size='large' disabled={isSubmitting}>
                    Register
                  </Button>
                  {status}
                </Segment>
              </Form>
            );
          }}
        />
      </Grid.Column>
    </Grid>
  </div>
);

export default RegisterForm;
