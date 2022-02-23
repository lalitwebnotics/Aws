import { put, takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';

import { join, once } from '../../store';
import { USER_AUTHORIZE, userAuthorize } from '../../api/user/actions';
import { INITIALIZE } from './actions';

/**
 * Watch initialize
 */
export function *watchInitialize() {
  yield takeLatest(INITIALIZE, function* handleInitialize() {
    yield put(userAuthorize());
    yield once(join(USER_AUTHORIZE, 'COMPLETE'));
    yield put(createAction(join(INITIALIZE, 'COMPLETE'))());
  });
}

export default [
  watchInitialize
];
