import { handleActions } from 'redux-actions';

import {
  ENGINE_MAKE,
  ENGINE_MAKES,
  ENGINE_MODEL,
  ENGINE_MODELS
} from './actions';
import { createReducers, createState } from '../../store';

/**
 * Engine state
 */
export const engineState = {
  ...createState('make'),
  ...createState('makes'),
  ...createState('model'),
  ...createState('models')
};

/**
 * Route reducer
 */
export default handleActions({
  ...createReducers(ENGINE_MAKE, 'make'),
  ...createReducers(ENGINE_MAKES, 'makes'),
  ...createReducers(ENGINE_MODEL, 'model'),
  ...createReducers(ENGINE_MODELS, 'models')
},
engineState);
