import { async } from '../../store';
import { user } from '../';
import {
  USER_AUTHORIZE,
  USER_LOGIN,
  USER_LOGOUT,
  USER_PASSWORD_RESET,
  USER_REGISTER,
  ACCOUNT_UPDATE
} from './actions';

export default [
  ...async(USER_AUTHORIZE, user.authorize),
  ...async(USER_LOGIN, user.login),
  ...async(USER_LOGOUT, user.logout),
  ...async(USER_PASSWORD_RESET, user.resetPassword),
  ...async(USER_REGISTER, user.register),
  ...async(ACCOUNT_UPDATE, user.updateAccount)
];
