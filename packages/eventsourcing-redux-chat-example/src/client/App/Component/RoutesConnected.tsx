import { connect } from 'react-redux';
import { StoreState } from '../../StoreState';
import { Routes } from './Routes';

const mapDispatchToProps = (state: StoreState) => {
  return {
    loggedIn: state.app.loggedIn,
  };
};

export const RoutesConnected = connect(mapDispatchToProps)(Routes);
