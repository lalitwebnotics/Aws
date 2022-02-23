import isArray from 'lodash/isArray';
import omit from 'lodash/omit';
import { bind, createFormData } from '../../utils';

/**
 * Category updates
 */
export const PRODUCT_UPDATES = {
  NONE: 0,
  PRICE: 1,
  REBATE: 2
};

/**
 * Titles
 */
export const TITLES = {
  PRODUCT_UPDATES: {
    NONE: 'None',
    PRICE: 'Price Update',
    REBATE: 'Rebates Update'
  }
};

/**
 * Product API
 */
export default class Product {

  constructor(api) {
    this.api = api;
    bind(this, [
      'deleteCategory',
      'getCategories',
      'getCategory',
      'postProduct',
      'putProduct',
      'getProduct',
      'deleteProduct',
      'getProducts',
      'getProductsCount',
      'getRandomCategoryIds',
      'getTracked',
      'postCategory',
      'postCertificate',
      'putCategory',
      'track'
    ]);
  }

  /**
   * Delete
   */
  deleteCategory(id) {
    return this.api.delete('products/categories/' + id);
  }

  /**
   * Get categories
   */
  getCategories(params = {}) {
    return this.api.get('products/categories', {
      params
    });
  }

  /**
   * Get category
   */
  getCategory(id) {
    return this.api.get('products/categories/' + id);
  }

  /**
   * Get products from hangar
   */
  getTracked(params = {}) {
    return this.api.get('products/tracked', {
      params
    });
  }

  /**
   * Get single product
   */
  getProduct(id) {
    return this.api.get('products/' + id);
  }

  /**
   * Get products
   */
  getProducts(params = {}) {
    return this.api.get('products', {
      params: {
        ...params,
        ...(!isArray(params.id) ? {} : {
          id: params.id.join(',')
        }),
        ...(!isArray(params.manufacturers) ? {} : {
          manufacturers: params.manufacturers.join(',')
        }),
        ...(!isArray(params.aircraft_makes) ? {} : {
          aircraft_makes: params.aircraft_makes.join(',')
        }),
        ...(!isArray(params.aircraft_models) ? {} : {
          aircraft_models: params.aircraft_models.join(',')
        })
      }
    });
  }

  /**
   * Get products count
   */
  getProductsCount(params = {}) {

    console.log(params);

    return this.api.get('products/count', {
      params
    }).then((count) => {
      return {
        count,
        results: []
      };
    });
  }

  /**
   * save product
   */
  postProduct(product) {
    let formData = { ...product };
    return this.api.post('products', formData);
  }

  /**
   * Update product
   */
  putProduct(params = {}) {
    let formData = {
      ...omit(params, [
        '_id'
      ])
    };
    return this.api.put('products/' + params._id, formData);
  }

  /**
   *  Delete product
   */
  deleteProduct(id) {
    return this.api.delete('products/' + id);
  }

  /**
   * Get random category ids
   */
  getRandomCategoryIds(count) {
    return this.api.get('products/categories/random', {
      params: {
        count
      }
    });
  }

  /**
   * Create category
   */
  postCategory(category) {
    return this.api.post('products/categories', {
      ...category
    });
  }

  /**
   * Update category
   */
  putCategory(params = {}) {
    return this.api.put('products/categories/' + params._id, {
      ...omit(params, [
        '_id'
      ])
    });
  }

  /**
   * Create certificate
   */
  postCertificate(certificate) {
    // return this.api.post('certificates', {
    //   ...certificate
    // });
  }

  /**
   * Track/untrack products
   */
  track({ id, track, updates }) {
    return this.api.post('products/track', {
      id,
      track,
      updates
    });
  }

  clearImages(id) {
    return this.api.delete('products/images/' + id);
  }

  notify(){
    return this.api.get('products/notify');
  }
}
