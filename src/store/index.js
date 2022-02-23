import keyBy from 'lodash/keyBy';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { createAction } from 'redux-actions';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';

import config from '../config';
import { history } from '../routes';
import reducers from './reducers';
import sagas, { watchActions } from './sagas';

/**
 * Saga middleware
 */
export const sagaMiddleware = createSagaMiddleware();

/**
 * Middleware
 */
export const middleware = applyMiddleware(...[
  routerMiddleware(history),
  sagaMiddleware,
  ...(config.redux.logger ? [logger] : [])
]);

/**
 * The store
 */
const store = createStore(reducers, undefined, compose(middleware));

/**
 * Create asynchronous actions (start, success, fail, and complete)
 */
export function async(name, options, args) {
  const request = isFunction(options) ? options : options.request
  if (!isFunction(request)) {
    throw new Error('Request parameter must be a function');
  }
  const types = ['SUCCESS', 'FAIL']
  const [query, success, fail, complete] = ['QUERY', ...types, 'COMPLETE'].map((type) =>
    createAction(join(name, type))
  );
  return ['', ...types].map((type) => {
    return function* watchAction() {
      yield takeEvery(join(name, type), function* handleAction(action) {
        if (type) {
          yield put(complete());
        } else {
          let params = args || options.args;
          if (isUndefined(params)) {
            params = [action.payload];
          } else if (isFunction(params)) {
            params = params(action);
          }
          try {
            yield put(query(params[0]));
            const response = yield call(request, ...params);
            yield put(success(response));
          } catch (error) {
            yield put(fail(error));
          }
        }
      });
    };
  });
}

/**
 * Create reducers
 */
export function createReducers(action, name, options) {
  const key = (isString(options) ? options : (options || {}).key) || '_id';
  return {
    [action]: (state) => ({
      ...state,
      [name]: {
        ...state[name],
        busy: true
      }
    }),
    [join(action, 'QUERY')]: (state, { payload = {} }) => ({
      ...state,
      [name]: {
        ...state[name],
        query: payload
      }
    }),
    [join(action, 'SUCCESS')]: (state, { payload }) => {
      const result = {};
      if (isNumber(payload.count) && isArray(payload.results)) {
        result.count = payload.count;
        result.data = keyBy(payload.results, key);
      } else {
        result.count = isEmpty(payload) ? 0 : 1;
        result.data = payload;
      }
      return {
        ...state,
        [name]: {
          ...state[name],
          ...result
        }
      };
    },
    [join(action, 'FAIL')]: (state, { payload }) => {
      return {
        ...state,
        [name]: {
          ...state[name],
          error: payload
        }
      };
    },
    [join(action, 'COMPLETE')]: (state) => ({
      ...state,
      [name]: {
        ...state[name],
        busy: false
      }
    }),
    [join(action, 'RESET')]: (state) => ({
      ...state,
      [name]: emptyState()
    })
  }
}

/**
 * Create state
 */
export function createState(name) {
  return {
    [name]: emptyState()
  };
}

/**
 * Empty state
 */
export function emptyState() {
  return {
    busy: false,
    count: 0,
    data: {},
    error: null,
    query: null
  };
}

/**
 * Join action
 */
export function join(action, type = '') {
  return action + (type ? ('_' + type) : '');
}

/**
 * Watch once
 */
export function once(action) {
  return new Promise((resolve) => {
    const watcher = watch([action], ({ payload }) => {
      watcher.cancel();
      resolve(payload);
    });
  });
}

/**
 * Call reset
 */
export function reset(...actions) {
  (actions || []).forEach((action) => {
    store.dispatch(createAction(join(action, 'RESET'))());
  });
}

/**
 * Watch
 */
export function watch(actions, listener) {
  return sagaMiddleware.run(watchActions, actions, listener);
}

/**
 * Promisify
 */
export function when(action) {
  return new Promise((...callback) => {
    const actions = [
      join(action.type, 'SUCCESS'),
      join(action.type, 'FAIL')
    ];
    const watcher = watch(actions, (result) => {
      callback[actions.indexOf(result.type)](result.payload);
      watcher.cancel();
    });
    store.dispatch(action);
  });
}

/**
 * Wrap in Provider
 */
export function wrap(children) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {children}
      </ConnectedRouter>
    </Provider>
  );
}

/**
 * Run middleware
 */
sagaMiddleware.run(sagas);

export default store;
