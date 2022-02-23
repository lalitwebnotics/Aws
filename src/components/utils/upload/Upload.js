import camelCase from 'lodash/camelCase';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import remove from 'lodash/remove';

import File from './File';

/**
 * Upload library
 */
export default class Upload {

  constructor(options = {}) {
    this.index = 0;
    this.files = [];
    this.options = {
      accept: [],
      auto: true,
      max: 0,
      ...options
    };
  }

  /**
   * Add file
   */
  add(file) {
    const added = new File(this, file);
    this.files.push(added);
    this.trigger('add', added);
    if (this.options.auto === true) {
      this.process();
    }
    return added;
  }

  /**
   * Destroy
   */
  destroy() {
    return this;
  }

  /**
   * Trigger event
   */
  trigger(name, ...args) {
    const callback = camelCase(['on', name].join(' '));
    if (isFunction(this.options[callback])) {
      this.options[callback](...args);
    }
  }

  /**
   * Get or set option
   */
  option(name, value) {
    if (isUndefined(value)) {
      return this.options[name];
    } else {
      this.options[name] = value;
      return this;
    }
  }

  /**
   * Process upload
   */
  process() {
    let count = 0;
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      if (file.uploading) {
        count++;
      } else {
        if (this.options.max > 0 && count >= this.options.max) {
          break;
        } else {
          file.start();
          count++;
        }
      }
    }
    return this;
  }

  /**
   * Remove a file
   */
  remove(file) {
    const index = isUndefined(file.index) ? file : file.index;
    remove(this.files, (item) => (
      item.index === index
    ));
    return this;
  }

  /**
   *
   */
  getFiles(){
    return this.files;
  }
}
