import { bind } from '../../utils';

/**
 * Retailer API
 */
export default class Retailer {

  constructor(api) {
    this.api = api;
    bind(this, [
      'deleteRetailerProduct',
      'getRetailerProduct',
      'getRetailerProducts',
      'postRetailerProduct',
      'getRetailersForProduct',
      'getProductsForRetailer',
      'putRetailerProduct'
    ]);
  }

  /**
   * Delete Retailer Product
   */
  deleteRetailerProduct(id) {
    return this.api.delete('retailer-products/' + id);
  }

  /**
   * Get Retailer Product
   */
  getRetailerProduct(id) {
    return this.api.get('retailer-products/' + id);
  }

  /**
   * Get Retailers for Product
   */
  getRetailersForProduct(id) {
    return this.api.get('retailer-products/retailers/' + id);
  }

  /**
   * Get Products for Retailer
   */
  getProductsForRetailer(id) {
    return this.api.get('retailer-products/products/' + id);
  }

  /**
   * Retailer Products
   */
  getRetailerProducts(params = {}) {
    return this.api.get('retailer-products', {
      params
    });
  }

  /**
   * Create Retailer Product
   */
  postRetailerProduct(product) {
    return this.api.post('retailer-products', {
      ...product
    });
  }

  /**
   * Update Retailer Product
   */
  putRetailerProduct(params = {}) {
    return this.api.put('retailer-products/' + params._id, {
      ...params
    });
  }
}
