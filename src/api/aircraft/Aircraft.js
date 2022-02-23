import keys from 'lodash/keys';

import { bind } from '../../utils';

/**
 * Category updates
 */
export const CATEGORY_UPDATES = {
  NONE: 0,
  ACTIVE: 1,
  PRICE: 2,
  REBATE: 4
};

/**
 * Email frequencies
 */
export const EMAIL_FREQUENCIES = {
  NONE: 0,
  DAILY: 1,
  WEEKLY: 2,
  MONTHLY: 3
};

/**
 * Product updates
 */
export const PRODUCT_UPDATES = {
  NONE: 0,
  APPROVED: 1,
  NONAPPROVED: 2
};

/**
 * Titles
 */
export const TITLES = {
  CATEGORY_UPDATES: {
    NONE: 'None',
    PRICE: 'Price Scan',
    REBATE: 'Rebate Alerts'
  },
  EMAIL_FREQUENCIES: {
    NONE: 'None',
    DAILY: 'Once a day',
    WEEKLY: 'Once a week',
    MONTHLY: 'Once a month'
  },
  PRODUCT_UPDATES: {
    NONE: 'None',
    APPROVED: 'Approved',
    NONAPPROVED: 'Non-approved'
  }
};

/**
 * Aircraft API
 */
export default class Aircraft {

  constructor(api) {
    this.api = api;
    bind(this, [
      'deleteHangar',
      'deleteMake',
      'deleteModel',
      'getHangar',
      'getHangarCount',
      'getMake',
      'getMakes',
      'getModel',
      'getModels',
      'getRandomModelIds',
      'getModelsFromMakes',
      'postAircraft',
      'postMake',
      'postModel',
      'putHangar',
      'putMake',
      'putModel',
      'uploadMakeModelCSV'
    ]);
  }

  /**
   * Delete
   */
  deleteHangar(id) {
    return this.api.delete('aircraft/' + id);
  }

  /**
   * Delete
   */
  uploadMakeModelCSV(formData) {
    return this.api.post('aircraft/makes/upload', formData);
  }

  /**
   * Delete
   */
  deleteMake(id) {
    return this.api.delete('aircraft/makes/' + id);
  }

  /**
   * Delete
   */
  deleteModel(id) {
    return this.api.delete('aircraft/models/' + id);
  }

  /**
   * Aircraft hangar
   */
  getHangar(params = {}) {
    return this.api.get('aircraft', {
      params
    });
  }

  /**
   * Aircraft hangar count
   */
  getHangarCount() {
    return this.getHangar({}).then(({ count }) => ({
      count,
      results: []
    }));
  }

  /**
   * Get make
   */
  getMake(id) {
    return this.api.get('aircraft/makes/' + id);
  }

  /**
   * Get makes
   */
  getMakes(params = {}) {
    return this.api.get('aircraft/makes', {
      params
    });
  }

  /**
   * Get model
   */
  getModel(id) {
    return this.api.get('aircraft/models/' + id);
  }

  /**
   * Get models
   */
  getModels(params = {}) {
    return this.api.get('aircraft/models', {
      params
    });
  }


  /**
   * Get random model ids
   */
  getRandomModelIds(count) {
    return this.api.get('aircraft/models/random', {
      params: {
        count
      }
    });
  }


  /**
   * Get All makes from Models
   *
   */

  getModelsFromMakes(makeIds) {
    return this.api.post('aircraft/makes/models', {
      makeIds
    });
  }

  /**
   * Create aircraft
   */
  postAircraft({ aircraft_model, year }) {
    return this.api.post('aircraft', {
      aircraft_model,
      year
    });
  }

  /**
   * Create make
   */
  postMake(make) {
    return this.api.post('aircraft/makes', {
      ...make
    });
  }

  /**
   * Create model
   */
  postModel(model) {
    return this.api.post('aircraft/models', {
      ...model
    });
  }

  /**
   * Save hangar
   */
  putHangar(params = {}) {
    const { categories, frequency, products } = params;
    return this.api.put('aircraft/' + params._id, {
      categories: keys(categories).map((category) => ({
        category,
        updates: categories[category]
      })),
      frequency,
      products
    });
  }

  /**
   * Update make
   */
  putMake(params = {}) {
    return this.api.put('aircraft/makes/' + params._id, {
      ...params
    });
  }

  /**
   * Update model
   */
  putModel(params = {}) {
    return this.api.put('aircraft/models/' + params._id, {
      ...params
    });
  }
}
