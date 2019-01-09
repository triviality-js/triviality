import React, { PureComponent } from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { Formik, FormikActions, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Assert } from '../../../shared/Assert';
import { FormikSemanticInput } from '../../Component/FormikSemanticInput';
import { registerAccount } from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const RegisterSchema = Yup.object().shape({
  name: Assert.userName,
  password: Assert.password,
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm password should equals password'),
});

export interface RegisterFormProps {
  register: (name: string, password: string) => Promise<void>;
}

const mapDispatchToProps = { register: registerAccount };

interface FormValues {
  password: string;
  passwordConfirm: string;
  email: string;
  name: string;
}

export const RegisterForm = connect(null, mapDispatchToProps)(
  class extends PureComponent<RegisterFormProps> {

    public render() {
      return (
        <div className="login-form">
          <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" textAlign="center">
                Register your account
              </Header>
              <Formik<FormValues>
                initialValues={{ password: '', passwordConfirm: '', email: '', name: '' }}
                validationSchema={RegisterSchema}
                onSubmit={this.onSubmit}
                render={this.renderForm}
              />
              <Message>
                Known to us? <Link to="/login" >Login</Link>
              </Message>
            </Grid.Column>
          </Grid>
        </div>
      );
    }

    public onSubmit = async (data: FormValues, { resetForm, setSubmitting, setStatus }: FormikActions<FormValues>) => {
      try {
        await this.props.register(data.name, data.password);
        resetForm();
      } catch (e) {
        setStatus(`${e}`);
        setSubmitting(false);
      }
    };

    public renderForm = (props: FormikProps<FormValues>) => {
      return (
        <Form size="large" onSubmit={props.handleSubmit}>
          <Segment stacked>
            <FormikSemanticInput
              icon="user"
              placeholder="Name"
              name="name"
              formikProps={props}
            />
            <FormikSemanticInput
              icon="lock"
              placeholder="Password"
              type="password"
              name="password"
              formikProps={props}
            />
            <FormikSemanticInput
              icon="lock"
              placeholder="Confirm password"
              type="password"
              name="passwordConfirm"
              formikProps={props}
            />
            <Button type="submit" fluid size="large" disabled={props.isSubmitting}>
              Register
            </Button>
            {props.status}
          </Segment>
        </Form>
      );
    };

  },
);
