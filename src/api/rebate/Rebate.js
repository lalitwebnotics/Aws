import { bind } from '../../utils';

/**
 * Rebate API
 */
export default class Rebate {

  constructor(api) {
    this.api = api;
    bind(this, [
      'deleteRebate',
      'getRebate',
      'getRebates',
      'postRebate',
      'putRebate'
    ]);
  }

  /**
   * Delete
   */
  deleteRebate(id) {
    return this.api.delete('rebates/' + id);
  }

  /**
   * Get rebate
   */
  getRebate(id) {
    return this.api.get('rebates/' + id);
  }

  /**
   * Rebates
   */
  getRebates(params = {}) {
    return this.api.get('rebates', {
      params
    });
  }

  /**
   * Create rebate
   */
  postRebate(rebate) {
    return this.api.post('rebates', {
      ...rebate
    });
  }

  /**
   * Update rebate
   */
  putRebate(params = {}) {
    return this.api.put('rebates/' + params._id, {
      ...params
    });
  }
}
