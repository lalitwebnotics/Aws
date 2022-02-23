import { async } from '../../store';
import { engine } from '../';
import {
  ENGINE_MAKE,
  ENGINE_MAKE_CREATE,
  ENGINE_MAKE_DELETE,
  ENGINE_MAKE_UPDATE,
  ENGINE_MAKES,
  ENGINE_MODEL,
  ENGINE_MODEL_CREATE,
  ENGINE_MODEL_DELETE,
  ENGINE_MODEL_UPDATE,
  ENGINE_MODELS
} from './actions';

export default [
  ...async(ENGINE_MAKE, engine.getMake),
  ...async(ENGINE_MAKE_CREATE, engine.postMake),
  ...async(ENGINE_MAKE_DELETE, engine.deleteMake),
  ...async(ENGINE_MAKE_UPDATE, engine.putMake),
  ...async(ENGINE_MAKES, engine.getMakes),
  ...async(ENGINE_MODEL, engine.getModel),
  ...async(ENGINE_MODEL_CREATE, engine.postModel),
  ...async(ENGINE_MODEL_DELETE, engine.deleteModel),
  ...async(ENGINE_MODEL_UPDATE, engine.putModel),
  ...async(ENGINE_MODELS, engine.getModels)
];
