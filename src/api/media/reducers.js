import { handleActions } from 'redux-actions';

import {
  UPLOAD_MEDIA
} from './actions';
import { createReducers, createState } from '../../store';

/**
 * Retailer Product state
 */
export const retailerState = {
  ...createState('uploaded_media')
};

/**
 * Route reducer
 */
export default handleActions({
  ...createReducers(UPLOAD_MEDIA, 'uploaded_media'),
},
retailerState);
