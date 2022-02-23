import { async } from '../../store';
import { aircraft } from '../';
import {
  AIRCRAFT_MAKE,
  AIRCRAFT_MAKE_CREATE,
  AIRCRAFT_MAKE_DELETE,
  AIRCRAFT_MAKE_UPDATE,
  AIRCRAFT_MAKES,
  AIRCRAFT_MODEL,
  AIRCRAFT_MODEL_CREATE,
  AIRCRAFT_MODEL_DELETE,
  AIRCRAFT_MODEL_UPDATE,
  AIRCRAFT_MODELS,
  AIRCRAFT_CREATE,
  AIRCRAFT_HANGAR,
  AIRCRAFT_HANGAR_COUNT,
  AIRCRAFT_HANGAR_DELETE,
  AIRCRAFT_HANGAR_UPDATE,
  AIRCRAFT_MAKE_MODEL_CSV
} from './actions';

export default [
  ...async(AIRCRAFT_MAKE, aircraft.getMake),
  ...async(AIRCRAFT_MAKE_CREATE, aircraft.postMake),
  ...async(AIRCRAFT_MAKE_DELETE, aircraft.deleteMake),
  ...async(AIRCRAFT_MAKE_UPDATE, aircraft.putMake),
  ...async(AIRCRAFT_MAKES, aircraft.getMakes),
  ...async(AIRCRAFT_MODEL, aircraft.getModel),
  ...async(AIRCRAFT_MODEL_CREATE, aircraft.postModel),
  ...async(AIRCRAFT_MODEL_DELETE, aircraft.deleteModel),
  ...async(AIRCRAFT_MODEL_UPDATE, aircraft.putModel),
  ...async(AIRCRAFT_MODELS, aircraft.getModels),
  ...async(AIRCRAFT_CREATE, aircraft.postAircraft),
  ...async(AIRCRAFT_HANGAR, aircraft.getHangar),
  ...async(AIRCRAFT_HANGAR_COUNT, aircraft.getHangarCount),
  ...async(AIRCRAFT_HANGAR_DELETE, aircraft.deleteHangar),
  ...async(AIRCRAFT_MAKE_MODEL_CSV, aircraft.uploadMakeModelCSV),
  ...async(AIRCRAFT_HANGAR_UPDATE, aircraft.putHangar)
];
