import { createAction } from 'redux-actions';

export const ENGINE_MAKE = 'ENGINE_MAKE';
export const ENGINE_MAKE_CREATE = 'ENGINE_MAKE_CREATE';
export const ENGINE_MAKE_DELETE = 'ENGINE_MAKE_DELETE';
export const ENGINE_MAKE_UPDATE = 'ENGINE_MAKE_UPDATE';
export const ENGINE_MAKES = 'ENGINE_MAKES';

export const ENGINE_MODEL = 'ENGINE_MODEL';
export const ENGINE_MODEL_CREATE = 'ENGINE_MODEL_CREATE';
export const ENGINE_MODEL_DELETE = 'ENGINE_MODEL_DELETE';
export const ENGINE_MODEL_UPDATE = 'ENGINE_MODEL_UPDATE';
export const ENGINE_MODELS = 'ENGINE_MODELS';

export const getEngineMake = createAction(ENGINE_MAKE);
export const createEngineMake = createAction(ENGINE_MAKE_CREATE);
export const deleteEngineMake = createAction(ENGINE_MAKE_DELETE);
export const updateEngineMake = createAction(ENGINE_MAKE_UPDATE);
export const getEngineMakes = createAction(ENGINE_MAKES);

export const getEngineModel = createAction(ENGINE_MODEL);
export const createEngineModel = createAction(ENGINE_MODEL_CREATE);
export const deleteEngineModel = createAction(ENGINE_MODEL_DELETE);
export const updateEngineModel = createAction(ENGINE_MODEL_UPDATE);
export const getEngineModels = createAction(ENGINE_MODELS);
