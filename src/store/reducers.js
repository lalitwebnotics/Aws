import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import { history } from '../routes';
import api from '../api/reducers';
import app from '../components/app/reducers';

const router = connectRouter(history);

export default combineReducers({
  api,
  app,
  router
});
