import api from '../../../api';

/**
 * Upload file
 */
export default class File {

  constructor(upload, file) {
    this.upload = upload;
    this.file = file;
    this.index = ++upload.index;
    this.progress = 0;
    this.uploading = false;
  }

  /**
   * Remove file
   */
  remove() {
    return this.upload.remove(this);
  }

  /**
   * Start upload
   */
  start() {
    if (this.uploading) {
      return this;
    }
    this.upload.trigger('start', this);
    const data = new FormData();
    data.append('file', this.file);
    api.post(this.upload.option('path') || '', data, {
      onUploadProgress: (...args) => {
        console.log('progress', ...args);
      }
    }).then(() => {
      console.log('upload complete');
    }).catch(() => {
      console.log('upload failed');
    });
    return this;
  }
}
