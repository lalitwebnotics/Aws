import { createAction } from 'redux-actions';

export const AIRCRAFT_MAKE = 'AIRCRAFT_MAKE';
export const AIRCRAFT_MAKE_CREATE = 'AIRCRAFT_MAKE_CREATE';
export const AIRCRAFT_MAKE_DELETE = 'AIRCRAFT_MAKE_DELETE';
export const AIRCRAFT_MAKE_UPDATE = 'AIRCRAFT_MAKE_UPDATE';
export const AIRCRAFT_MAKES = 'AIRCRAFT_MAKES';

export const AIRCRAFT_MODEL = 'AIRCRAFT_MODEL';
export const AIRCRAFT_MODEL_CREATE = 'AIRCRAFT_MODEL_CREATE';
export const AIRCRAFT_MODEL_DELETE = 'AIRCRAFT_MODEL_DELETE';
export const AIRCRAFT_MODEL_UPDATE = 'AIRCRAFT_MODEL_UPDATE';
export const AIRCRAFT_MODELS = 'AIRCRAFT_MODELS';

export const AIRCRAFT_MAKE_MODEL_CSV = 'AIRCRAFT_MAKE_MODEL_CSV';

export const AIRCRAFT_CREATE = 'AIRCRAFT_CREATE';
export const AIRCRAFT_HANGAR = 'AIRCRAFT_HANGAR';
export const AIRCRAFT_HANGAR_COUNT = 'AIRCRAFT_HANGAR_COUNT';
export const AIRCRAFT_HANGAR_DELETE = 'AIRCRAFT_HANGAR_DELETE';
export const AIRCRAFT_HANGAR_UPDATE = 'AIRCRAFT_HANGAR_UPDATE';

export const getAircraftMake = createAction(AIRCRAFT_MAKE);
export const createAircraftMake = createAction(AIRCRAFT_MAKE_CREATE);
export const deleteAircraftMake = createAction(AIRCRAFT_MAKE_DELETE);
export const updateAircraftMake = createAction(AIRCRAFT_MAKE_UPDATE);
export const getAircraftMakes = createAction(AIRCRAFT_MAKES);
export const uploadAircraftMakeModelCsv = createAction(AIRCRAFT_MAKE_MODEL_CSV);

export const getAircraftModel = createAction(AIRCRAFT_MODEL);
export const createAircraftModel = createAction(AIRCRAFT_MODEL_CREATE);
export const deleteAircraftModel = createAction(AIRCRAFT_MODEL_DELETE);
export const updateAircraftModel = createAction(AIRCRAFT_MODEL_UPDATE);
export const getAircraftModels = createAction(AIRCRAFT_MODELS);

export const createAircraft = createAction(AIRCRAFT_CREATE);
export const getAircraftHangar = createAction(AIRCRAFT_HANGAR);
export const getAircraftHangarCount = createAction(AIRCRAFT_HANGAR_COUNT);
export const deleteAircraftHangar = createAction(AIRCRAFT_HANGAR_DELETE);
export const updateAircraftHangar = createAction(AIRCRAFT_HANGAR_UPDATE);
