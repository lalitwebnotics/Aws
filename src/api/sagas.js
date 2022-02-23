import aircraft from './aircraft/sagas';
import engine from './engine/sagas';
import manufacturer from './manufacturer/sagas';
import product from './product/sagas';
import user from './user/sagas';
import rebate from './rebate/sagas';
import retailer from './retailer/sagas';
import certificate from './certificate/sagas';
import retailerProduct from './retailer_products/sagas';
import media from './media/sagas';

export default [
  ...aircraft,
  ...engine,
  ...manufacturer,
  ...product,
  ...user,
  ...rebate,
  ...certificate,
  ...media,
  ...retailer,
  ...retailerProduct
];
