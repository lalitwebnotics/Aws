import { async } from '../../store';
import { retailer } from '../';
import {
  RETAILER,
  RETAILER_CREATE,
  RETAILER_DELETE,
  RETAILER_UPDATE,
  RETAILERS
} from './actions';

export default [
  ...async(RETAILER, retailer.getRetailer),
  ...async(RETAILER_CREATE, retailer.postRetailer),
  ...async(RETAILER_DELETE, retailer.deleteRetailer),
  ...async(RETAILER_UPDATE, retailer.putRetailer),
  ...async(RETAILERS, retailer.getRetailers)
];
