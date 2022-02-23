import { async } from '../../store';
import { retailerProduct } from '../';
import {
  RETAILER_PRODUCT,
  RETAILER_PRODUCT_CREATE,
  RETAILER_PRODUCT_DELETE,
  RETAILER_PRODUCT_UPDATE,
  RETAILER_PRODUCTS,
  RETAILERS_FOR_PRODUCT,
  PRODUCTS_FOR_RETAILER
} from './actions';

export default [
  ...async(RETAILER_PRODUCT, retailerProduct.getRetailerProduct),
  ...async(RETAILER_PRODUCT_CREATE, retailerProduct.postRetailerProduct),
  ...async(RETAILER_PRODUCT_DELETE, retailerProduct.deleteRetailerProduct),
  ...async(RETAILER_PRODUCT_UPDATE, retailerProduct.putRetailerProduct),
  ...async(RETAILER_PRODUCTS, retailerProduct.getRetailerProducts),
  ...async(RETAILERS_FOR_PRODUCT, retailerProduct.getRetailersForProduct),
  ...async(PRODUCTS_FOR_RETAILER, retailerProduct.getProductsForRetailer)
];
