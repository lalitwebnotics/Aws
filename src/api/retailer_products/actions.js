import { createAction } from 'redux-actions';

export const RETAILER_PRODUCT = 'RETAILER_PRODUCT';
export const RETAILER_PRODUCT_CREATE = 'RETAILER_PRODUCT_CREATE';
export const RETAILER_PRODUCT_DELETE = 'RETAILER_PRODUCT_DELETE';
export const RETAILER_PRODUCT_UPDATE = 'RETAILER_PRODUCT_UPDATE';
export const RETAILER_PRODUCTS = 'RETAILER_PRODUCTS';
export const RETAILERS_FOR_PRODUCT = 'RETAILERS_FOR_PRODUCT';
export const PRODUCTS_FOR_RETAILER = 'PRODUCTS_FOR_RETAILER';

export const getRetailerProduct = createAction(RETAILER_PRODUCT);
export const postRetailerProduct = createAction(RETAILER_PRODUCT_CREATE);
export const deleteRetailerProduct = createAction(RETAILER_PRODUCT_DELETE);
export const putRetailerProduct = createAction(RETAILER_PRODUCT_UPDATE);
export const getRetailerProducts = createAction(RETAILER_PRODUCTS);
export const getRetailersForProduct = createAction(RETAILERS_FOR_PRODUCT);
export const getProductsForRetailer = createAction(PRODUCTS_FOR_RETAILER);
