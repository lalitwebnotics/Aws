import { createAction } from 'redux-actions';

export const RETAILER = 'RETAILER';
export const RETAILER_CREATE = 'RETAILER_CREATE';
export const RETAILER_DELETE = 'RETAILER_DELETE';
export const RETAILER_UPDATE = 'RETAILER_UPDATE';
export const RETAILERS = 'RETAILERS';

export const getRetailer = createAction(RETAILER);
export const createRetailer = createAction(RETAILER_CREATE);
export const deleteRetailer = createAction(RETAILER_DELETE);
export const updateRetailer = createAction(RETAILER_UPDATE);
export const getRetailers = createAction(RETAILERS);
