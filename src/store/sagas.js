import { all, fork, takeEvery } from 'redux-saga/effects';

import api from '../api/sagas';
import app from '../components/app/sagas';

/**
 * Watch actions
 */
export function* watchActions(actions, listener) {
  yield all(actions.map((action) => {
    return fork(function* watchAction() {
      yield takeEvery(action, listener);
    });
  }))
}

/**
 * Root saga
 */
export default function* rootSaga() {
  yield all(api.map(fork));
  yield all(app.map(fork));
}
