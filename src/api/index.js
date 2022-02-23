import API from './API';
import Aircraft from './aircraft/Aircraft';
import Engine from './engine/Engine';
import Manufacturer from './manufacturer/Manufacturer';
import Rebate from './rebate/Rebate';
import Certificate from './certificate/Certificate';
import Media from './media/Media';
import Retailer from './retailer/Retailer';
import RetailerProduct from './retailer_products/RetailerProduct';
import Product from './product/Product';
import User from './user/User';
import config from '../config';

const api = new API(config.api);

export const aircraft = new Aircraft(api);
export const engine = new Engine(api);
export const manufacturer = new Manufacturer(api);
export const product = new Product(api);
export const user = new User(api);
export const rebate = new Rebate(api);
export const certificate = new Certificate(api);
export const retailer = new Retailer(api);
export const retailerProduct = new RetailerProduct(api);
export const media = new Media(api);

export default api;

/**
 * Initialize API
 */
api.init();
