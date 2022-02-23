import { bind } from '../../utils';

/**
 * Retailer API
 */
export default class Retailer {

  constructor(api) {
    this.api = api;
    bind(this, [
      'deleteRetailer',
      'getRetailer',
      'getRetailers',
      'postRetailer',
      'putRetailer'
    ]);
  }

  /**
   * Delete
   */
  deleteRetailer(id) {
    return this.api.delete('retailers/' + id);
  }

  /**
   * Get rebate
   */
  getRetailer(id) {
    return this.api.get('retailers/' + id);
  }

  /**
   * Retailers
   */
  getRetailers(params = {}) {
    return this.api.get('retailers', {
      params
    });
  }

  /**
   * Create rebate
   */
  postRetailer(rebate) {
    return this.api.post('retailers', {
      ...rebate
    });
  }

  /**
   * Update rebate
   */
  putRetailer(params = {}) {
    return this.api.put('retailers/' + params._id, {
      ...params
    });
  }
}
