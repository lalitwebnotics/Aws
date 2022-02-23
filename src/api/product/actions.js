import { createAction } from 'redux-actions';

export const CATEGORIES = 'CATEGORIES';
export const CATEGORY_CREATE = 'CATEGORY_CREATE';
export const CATEGORY_DELETE = 'CATEGORY_DELETE';
export const CATEGORY_UPDATE = 'CATEGORY_UPDATE';
export const CATEGORY = 'CATEGORY';

export const CERTIFICATE_CREATE = 'CERTIFICATE_CREATE';
export const CERTIFICATE_DELETE = 'CERTIFICATE_DELETE';
export const CERTIFICATE_UPDATE = 'CERTIFICATE_UPDATE';
export const CERTIFICATE = 'CERTIFICATE';

export const PRODUCT_CREATE = 'PRODUCT_CREATE';
export const PRODUCT_UPDATE = 'PRODUCT_UPDATE';
export const PRODUCT_DELETE = 'PRODUCT_DELETE';
export const PRODUCT = 'PRODUCT';
export const PRODUCTS = 'PRODUCTS';
export const PRODUCTS_COUNT_ALL = 'PRODUCTS_COUNT_ALL';
export const PRODUCTS_COUNT_AIRCRAFT_MAKES = 'PRODUCTS_COUNT_AIRCRAFT_MAKES';
export const PRODUCTS_COUNT_AIRCRAFT_MODELS = 'PRODUCTS_COUNT_AIRCRAFT_MODELS';
export const PRODUCTS_COUNT_APPROVED_AIRCRAFT_MAKES = 'PRODUCTS_COUNT_APPROVED_AIRCRAFT_MAKES';
export const PRODUCTS_COUNT_APPROVED_AIRCRAFT_MODELS = 'PRODUCTS_COUNT_APPROVED_AIRCRAFT_MODELS';
export const PRODUCTS_COUNT_CATEGORIES = 'PRODUCTS_COUNT_CATEGORIES';
// export const PRODUCTS_COUNT_APPROVED_AIRCRAFT_MODELS_CATEGORIES = 'PRODUCTS_COUNT_APPROVED_AIRCRAFT_MODELS_CATEGORIES';
export const PRODUCTS_TRACK = 'PRODUCTS_TRACK';
export const PRODUCTS_TRACKED = 'PRODUCTS_TRACKED';
export const PRODUCTS_RELOAD = 'PRODUCTS_RELOAD';

export const getCategories = createAction(CATEGORIES);
export const createCategory = createAction(CATEGORY_CREATE);
export const deleteCategory = createAction(CATEGORY_DELETE);
export const updateCategory = createAction(CATEGORY_UPDATE);
export const getCategory = createAction(CATEGORY);

export const createCertificate = createAction(CERTIFICATE_CREATE);
export const deleteCertificate = createAction(CERTIFICATE_DELETE);
export const updateCertificate = createAction(CERTIFICATE_UPDATE);
export const getCertificate = createAction(CERTIFICATE);

export const getProduct = createAction(PRODUCT);
export const getProducts = createAction(PRODUCTS);
export const createProduct = createAction(PRODUCT_CREATE);
export const updateProduct = createAction(PRODUCT_UPDATE);
export const deleteProduct = createAction(PRODUCT_DELETE);
export const getProductsCountAll = createAction(PRODUCTS_COUNT_ALL);
export const getProductsCountAircraftMakes = createAction(PRODUCTS_COUNT_AIRCRAFT_MAKES);
export const getProductsCountAircraftModels = createAction(PRODUCTS_COUNT_AIRCRAFT_MODELS);
export const getProductsCountApprovedAircraftMakes = createAction(PRODUCTS_COUNT_APPROVED_AIRCRAFT_MAKES);
export const getProductsCountApprovedAircraftModels = createAction(PRODUCTS_COUNT_APPROVED_AIRCRAFT_MODELS);
export const getProductsCountCategories = createAction(PRODUCTS_COUNT_CATEGORIES);
export const getTracked = createAction(PRODUCTS_TRACKED);
export const trackProducts = createAction(PRODUCTS_TRACK);
export const reloadProducts = createAction(PRODUCTS_RELOAD);
