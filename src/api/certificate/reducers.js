import { handleActions } from 'redux-actions';

import {
  CERTIFICATE,
  CERTIFICATES
} from './actions';
import { createReducers, createState } from '../../store';

/**
 * Manufacturer state
 */
export const certificateState = {
  ...createState('certificate'),
  ...createState('certificates')
};

/**
 * Route reducer
 */
export default handleActions({
  ...createReducers(CERTIFICATE, 'certificate'),
  ...createReducers(CERTIFICATES, 'certificates')
},
certificateState);
