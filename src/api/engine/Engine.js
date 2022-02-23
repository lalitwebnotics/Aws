import { bind } from '../../utils';

/**
 * Engine types
 */
export const TYPES = {
  carbureted: 'Carbureted',
  injected: 'Injected'
};

/**
 * Engine API
 */
export default class Engine {

  constructor(api) {
    this.api = api;
    bind(this, [
      'deleteMake',
      'deleteModel',
      'getMake',
      'getMakes',
      'getModel',
      'getModels',
      'postMake',
      'postModel',
      'putMake',
      'putModel'
    ]);
  }

  /**
   * Delete
   */
  deleteMake(id) {
    return this.api.delete('engines/makes/' + id);
  }

  /**
   * Delete
   */
  deleteModel(id) {
    return this.api.delete('engines/models/' + id);
  }

  /**
   * Get make
   */
  getMake(id) {
    return this.api.get('engines/makes/' + id);
  }

  /**
   * Makes
   */
  getMakes(params = {}) {
    return this.api.get('engines/makes', {
      params
    });
  }

  /**
   * Get model
   */
  getModel(id) {
    return this.api.get('engines/models/' + id);
  }

  /**
   * Models
   */
  getModels(params = {}) {
    return this.api.get('engines/models', {
      params
    });
  }

  /**
   * Create make
   */
  postMake(make) {
    return this.api.post('engines/makes', {
      ...make
    });
  }

  /**
   * Create model
   */
  postModel(model) {
    return this.api.post('engines/models', {
      ...model
    });
  }

  /**
   * Update make
   */
  putMake(params = {}) {
    return this.api.put('engines/makes/' + params._id, {
      ...params
    });
  }

  /**
   * Update model
   */
  putModel(params = {}) {
    return this.api.put('engines/models/' + params._id, {
      ...params
    });
  }
}
