import { combineReducers } from 'redux';

import aircraft from './aircraft/reducers';
import engine from './engine/reducers';
import manufacturer from './manufacturer/reducers';
import product from './product/reducers';
import user from './user/reducers';
import media from './media/reducers';
import rebate from './rebate/reducers';
import retailer from './retailer/reducers';
import retailerProduct from './retailer_products/reducers';
import certificate from './certificate/reducers';

export default combineReducers({
  aircraft,
  engine,
  manufacturer,
  product,
  user,
  media,
  rebate,
  retailer,
  retailerProduct,
  certificate
});
