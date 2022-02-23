import { handleActions } from 'redux-actions';

import {
  USER_AUTHORIZE,
  USER_LOGOUT,
  USER_PASSWORD_RESET,
  USER_REGISTER
} from './actions';
import { createReducers, createState } from '../../store';

/**
 * User state
 */
export const userState = {
  ...createState('auth'),
  ...createState('passwordReset'),
  ...createState('register')
};

/**
 * Route reducer
 */
export default handleActions({
  ...createReducers(USER_AUTHORIZE, 'auth'),
  ...createReducers(USER_LOGOUT, 'auth'),
  ...createReducers(USER_PASSWORD_RESET, 'passwordReset'),
  ...createReducers(USER_REGISTER, 'register')
},
userState);
