import { async } from '../../store';
import { manufacturer } from '../';
import {
  MANUFACTURER,
  MANUFACTURER_CREATE,
  MANUFACTURER_DELETE,
  MANUFACTURER_UPDATE,
  MANUFACTURERS
} from './actions';

export default [
  ...async(MANUFACTURER, manufacturer.getManufacturer),
  ...async(MANUFACTURER_CREATE, manufacturer.postManufacturer),
  ...async(MANUFACTURER_DELETE, manufacturer.deleteManufacturer),
  ...async(MANUFACTURER_UPDATE, manufacturer.putManufacturer),
  ...async(MANUFACTURERS, manufacturer.getManufacturers)
];
