import { handleActions } from 'redux-actions';

import {
  MANUFACTURER,
  MANUFACTURERS
} from './actions';
import { createReducers, createState } from '../../store';

/**
 * Manufacturer state
 */
export const manufacturerState = {
  ...createState('manufacturer'),
  ...createState('manufacturers')
};

/**
 * Route reducer
 */
export default handleActions({
  ...createReducers(MANUFACTURER, 'manufacturer'),
  ...createReducers(MANUFACTURERS, 'manufacturers')
},
manufacturerState);
