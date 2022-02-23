import { handleActions } from 'redux-actions';

import {
  AIRCRAFT_MAKE,
  AIRCRAFT_MAKES,
  AIRCRAFT_MODEL,
  AIRCRAFT_MODELS,
  AIRCRAFT_HANGAR,
  AIRCRAFT_HANGAR_COUNT,
  AIRCRAFT_HANGAR_DELETE,
  AIRCRAFT_HANGAR_UPDATE,
  AIRCRAFT_MAKE_MODEL_CSV
} from './actions';
import { createReducers, createState } from '../../store';

/**
 * Aircraft state
 */
export const aircraftState = {
  ...createState('make'),
  ...createState('makes'),
  ...createState('model'),
  ...createState('models'),
  ...createState('hangar'),
  ...createState('countHangar'),
  ...createState('deleteHangar'),
  ...createState('makeModelCSV'),
  ...createState('updateHangar')
};

/**
 * Route reducer
 */
export default handleActions({
  ...createReducers(AIRCRAFT_MAKE, 'make'),
  ...createReducers(AIRCRAFT_MAKES, 'makes'),
  ...createReducers(AIRCRAFT_MODEL, 'model'),
  ...createReducers(AIRCRAFT_MODELS, 'models'),
  ...createReducers(AIRCRAFT_HANGAR, 'hangar'),
  ...createReducers(AIRCRAFT_HANGAR_COUNT, 'countHangar'),
  ...createReducers(AIRCRAFT_HANGAR_DELETE, 'deleteHangar'),
  ...createReducers(AIRCRAFT_MAKE_MODEL_CSV, 'makeModelCSV'),
  ...createReducers(AIRCRAFT_HANGAR_UPDATE, 'updateHangar')
},
aircraftState);
