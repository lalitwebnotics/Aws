import { bind } from '../../utils';

/**
 * Retailer API
 */
export default class Retailer {

  constructor(api) {
    this.api = api;
    bind(this, [
      'uploadMedia'
    ]);
  }

  /**
   * Create Retailer Product
   */
  uploadMedia({ media: files = {}, for: type }) {
    const formData = new FormData();
    for(let file=0; file< files.length; file++) {
      formData.append('media', files[file]);
    }
    return this.api.post(`media/upload-multiple/${type}`, formData);
  }
}
