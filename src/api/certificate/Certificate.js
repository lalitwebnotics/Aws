import { bind } from '../../utils';

/**
 * Certificate API
 */
export default class Certificate {

  constructor(api) {
    this.api = api;
    
    bind(this, [
      'deleteCertificate',
      'getCertificate',
      'getCertificates',
      'postCertificate',
      'putCertificate'
    ]);
  }

  /**
   * Delete
   */
  deleteCertificate(id) {
    return this.api.delete('certificates/' + id);
  }

  /**
   * Get certificate
   */
  getCertificate(id) {
    return this.api.get('certificates/' + id);
  }

  /**
   * Certificates
   */
  getCertificates(params = {}) {
    return this.api.get('certificates', {
      params
    });
  }

  /**
   * Create certificate
   */
  postCertificate(certificate) {
    return this.api.post('certificates', {
      ...certificate
    });
  }

  /**
   * Update certificate
   */
  putCertificate(params = {}) {
    return this.api.put('certificates/' + params._id, {
      ...params
    });
  }
}
