import { createAction } from 'redux-actions';

export const MANUFACTURER = 'MANUFACTURER';
export const MANUFACTURER_CREATE = 'MANUFACTURER_CREATE';
export const MANUFACTURER_DELETE = 'MANUFACTURER_DELETE';
export const MANUFACTURER_UPDATE = 'MANUFACTURER_UPDATE';
export const MANUFACTURERS = 'MANUFACTURERS';

export const getManufacturer = createAction(MANUFACTURER);
export const createManufacturer = createAction(MANUFACTURER_CREATE);
export const deleteManufacturer = createAction(MANUFACTURER_DELETE);
export const updateManufacturer = createAction(MANUFACTURER_UPDATE);
export const getManufacturers = createAction(MANUFACTURERS);
