import { handleActions } from 'redux-actions';

import {
  REBATE,
  REBATES
} from './actions';
import { createReducers, createState } from '../../store';

/**
 * Manufacturer state
 */
export const rebateState = {
  ...createState('rebate'),
  ...createState('rebates')
};

/**
 * Route reducer
 */
export default handleActions({
  ...createReducers(REBATE, 'rebate'),
  ...createReducers(REBATES, 'rebates')
},
rebateState);
