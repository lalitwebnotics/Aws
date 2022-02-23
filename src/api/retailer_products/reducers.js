import { handleActions } from 'redux-actions';

import {
  RETAILER_PRODUCT,
  RETAILER_PRODUCTS,
  PRODUCTS_FOR_RETAILER,
  RETAILERS_FOR_PRODUCT
} from './actions';
import { createReducers, createState } from '../../store';

/**
 * Retailer Product state
 */
export const retailerState = {
  ...createState('retailer_product'),
  ...createState('retailer_products'),
  ...createState('products_of_retailer'),
  ...createState('retailers_of_product')
};

/**
 * Route reducer
 */
export default handleActions({
  ...createReducers(RETAILER_PRODUCT, 'retailer_product'),
  ...createReducers(RETAILER_PRODUCTS, 'retailer_products'),
  ...createReducers(PRODUCTS_FOR_RETAILER, 'products_of_retailer'),
  ...createReducers(RETAILERS_FOR_PRODUCT, 'retailers_of_product')
},
retailerState);
