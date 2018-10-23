import { connect } from 'react-redux';
import { AccountState } from '../AcountState';
import { registerAccount } from '../actions';
import RegisterForm from './RegisterForm';

export const mapStateToProps = (_state: AccountState) => {
  return {};
};

const mapDispatchToProps = { register: registerAccount };

export const ConnectedRegisterForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterForm);
