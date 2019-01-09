import React, { ComponentClass, PureComponent } from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import { Formik, FormikActions, FormikProps } from 'formik';
import { logoutAccount } from '../actions';
import { connect } from 'react-redux';

export interface LogoutFormProps {
  logout: () => Promise<void>;
}

const mapDispatchToProps = { logout: logoutAccount };

interface FormValues {
}

export const LogoutForm: ComponentClass<{}> = connect(null, mapDispatchToProps)(
  class extends PureComponent<LogoutFormProps> {

    public render() {
      return (
        <div className="login-form">
          <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" textAlign="center">
                Logout from your account
              </Header>
              <Formik<FormValues>
                isInitialValid={true}
                initialValues={{}}
                onSubmit={this.onSubmit}
                render={this.renderForm}
              />
            </Grid.Column>
          </Grid>
        </div>
      );
    }

    public onSubmit = async (_data: FormValues, { resetForm, setSubmitting, setStatus }: FormikActions<FormValues>) => {
      try {
        await this.props.logout();
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
            <Button type="submit" fluid size="large" disabled={props.isSubmitting}>
              Logout
            </Button>
            {props.status}
          </Segment>
        </Form>
      );
    };

  },
);
