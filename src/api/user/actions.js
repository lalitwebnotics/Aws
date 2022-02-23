import { createAction } from 'redux-actions';

export const USER_AUTHORIZE = 'USER_AUTHORIZE';
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_PASSWORD_RESET = 'USER_PASSWORD_RESET';
export const USER_REGISTER = 'USER_REGISTER';
export const ACCOUNT_UPDATE = 'ACCOUNT_UPDATE';

export const userAuthorize = createAction(USER_AUTHORIZE);
export const userLogin = createAction(USER_LOGIN);
export const userLogout = createAction(USER_LOGOUT);
export const userPasswordReset = createAction(USER_PASSWORD_RESET);
export const userRegister = createAction(USER_REGISTER);
export const updateAccount = createAction(ACCOUNT_UPDATE);
