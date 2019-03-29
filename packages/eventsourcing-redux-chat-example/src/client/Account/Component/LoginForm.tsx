import { Formik, FormikActions, FormikProps } from 'formik';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import * as Yup from 'yup';
import { Assert } from '../../../shared/Assert';
import { FormikSemanticInput } from '../../Component/FormikSemanticInput';
import { loginAccount } from '../actions';

const LoginSchema = Yup.object().shape({
  name: Assert.userName,
  password: Assert.password,
});

export interface LoginFormProps {
  login: (name: string, password: string) => Promise<void>;
}

const mapDispatchToProps = { login: loginAccount };

interface FormValues {
  password: string;
  passwordConfirm: string;
  email: string;
  name: string;
}

export const LoginForm = connect(null, mapDispatchToProps)(
  class extends PureComponent<LoginFormProps> {

    public render() {
      return (
        <div className="login-form">
          <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" textAlign="center">
                Login your account
              </Header>
              <Formik<FormValues>
                initialValues={{ password: '', passwordConfirm: '', email: '', name: '' }}
                validationSchema={LoginSchema}
                onSubmit={this.onSubmit}
                render={this.renderForm}
              />
              <Message>
                New to us? <Link to="/register">Sign Up</Link>
              </Message>
            </Grid.Column>
          </Grid>
        </div>
      );
    }

    public onSubmit = async (data: FormValues, { resetForm, setSubmitting, setStatus }: FormikActions<FormValues>) => {
      try {
        await this.props.login(data.name, data.password);
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
            <Button type="submit" fluid size="large" disabled={props.isSubmitting}>
              Login
            </Button>
            {props.status}
          </Segment>
        </Form>
      );
    };

  },
);
