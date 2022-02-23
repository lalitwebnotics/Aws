import { bind } from '../../utils';

/**
 * Manufacturer API
 */
export default class Manufacturer {

  constructor(api) {
    this.api = api;
    bind(this, [
      'deleteManufacturer',
      'getManufacturer',
      'getManufacturers',
      'postManufacturer',
      'putManufacturer'
    ]);
  }

  /**
   * Delete
   */
  deleteManufacturer(id) {
    return this.api.delete('manufacturers/' + id);
  }

  /**
   * Get manufacturer
   */
  getManufacturer(id) {
    return this.api.get('manufacturers/' + id);
  }

  /**
   * Manufacturers
   */
  getManufacturers(params = {}) {
    return this.api.get('manufacturers', {
      params
    });
  }

  /**
   * Create manufacturer
   */
  postManufacturer(manufacturer) {
    return this.api.post('manufacturers', {
      ...manufacturer
    });
  }

  /**
   * Update manufacturer
   */
  putManufacturer(params = {}) {
    return this.api.put('manufacturers/' + params._id, {
      ...params
    });
  }
}
