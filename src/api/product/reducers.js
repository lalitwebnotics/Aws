import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import keyBy from 'lodash/keyBy';
import { handleActions } from 'redux-actions';

import {
  CATEGORIES,
  CATEGORY,
  CERTIFICATE,
  PRODUCT,
  PRODUCTS,
  PRODUCTS_COUNT_ALL,
  PRODUCTS_COUNT_AIRCRAFT_MAKES,
  PRODUCTS_COUNT_AIRCRAFT_MODELS,
  PRODUCTS_COUNT_APPROVED_AIRCRAFT_MAKES,
  PRODUCTS_COUNT_APPROVED_AIRCRAFT_MODELS,
  PRODUCTS_COUNT_CATEGORIES,
  PRODUCTS_TRACKED
} from './actions';
import { createReducers, createState } from '../../store';

/**
 * Product state
 */
export const productState = {
  ...createState('categories'),
  ...createState('category'),
  ...createState('certificate'),
  ...createState('product'),
  ...createState('products'),
  ...createState('countAll'),
  ...createState('countAircraftMakes'),
  ...createState('countAircraftModels'),
  ...createState('countCategories'),
  ...createState('countApprovedAircraftMakes'),
  ...createState('countApprovedAircraftModels'),
  ...createState('tracked')
};

/**
 * Route reducer
 */
export default handleActions({
  ...createReducers(CATEGORIES, 'categories'),
  ...createReducers(CATEGORY, 'category'),
  ...createReducers(CERTIFICATE, 'certificate'),
  ...createReducers(PRODUCT, 'product'),
  ...createReducers(PRODUCTS, 'products'),
  ...createReducers(PRODUCTS_COUNT_ALL, 'countAll'),
  ...createReducers(PRODUCTS_COUNT_AIRCRAFT_MAKES, 'countAircraftMakes'),
  ...createReducers(PRODUCTS_COUNT_AIRCRAFT_MODELS, 'countAircraftModels'),
  ...createReducers(PRODUCTS_COUNT_APPROVED_AIRCRAFT_MAKES, 'countApprovedAircraftMakes'),
  ...createReducers(PRODUCTS_COUNT_APPROVED_AIRCRAFT_MODELS, 'countApprovedAircraftModels'),
  ...createReducers(PRODUCTS_COUNT_CATEGORIES, 'countCategories'),
  ...createReducers(PRODUCTS_TRACKED, 'tracked'),
  PRODUCTS_RELOAD_SUCCESS: onProductsReloadSuccess
},
productState);

/**
 * On products reload success
 */
export function onProductsReloadSuccess(state, { payload }) {
  if (isEmpty(payload) || !payload.count || !payload.results || !payload.results.length) {
    return state;
  }
  const data = payload.results.find((result) => (result._id === state.product.data._id));
  return {
    ...state,
    product: {
      ...state.product,
      ...(!data ? {} : {
        data
      })
    },
    products: {
      ...state.products,
      data: {
        ...state.products.data,
        ...keyBy(payload.results.filter((result) => (
          !isUndefined(state.products.data[result._id])
        )), '_id')
      }
    },
    tracked: {
      ...state.tracked,
      data: {
        ...state.tracked.data,
        ...keyBy(payload.results.filter((result) => (
          !isUndefined(state.tracked.data[result._id])
        )), '_id')
      }
    }
  };
}
