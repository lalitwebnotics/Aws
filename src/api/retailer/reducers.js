import { handleActions } from 'redux-actions';

import {
  RETAILER,
  RETAILERS
} from './actions';
import { createReducers, createState } from '../../store';

/**
 * Manufacturer state
 */
export const retailerState = {
  ...createState('retailer'),
  ...createState('retailers')
};

/**
 * Route reducer
 */
export default handleActions({
  ...createReducers(RETAILER, 'retailer'),
  ...createReducers(RETAILERS, 'retailers')
},
retailerState);
