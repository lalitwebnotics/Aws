import keys from 'lodash/keys';
import isUndefined from 'lodash/isUndefined';
import trimStart from 'lodash/trimStart';
import axios, { CancelToken } from 'axios';
import cookie from 'js-cookie';

import { bind } from '../utils';

export const SECONDS_PER_DAY = 60 * 60 * 24;

/**
 * API methods
 */
export default class API {

  constructor(config) {
    this.config = config;
    this.index = 0;
    this.pending = {};
    this.timeouts = {};
    this.token = null;
    bind(this, [
      'cancel',
      'delete',
      'get',
      'post',
      'request'
    ]);
  }

  /**
   * Initialize
   */
  init() {
    this.token = cookie.get(this.config.token || 'token') || null;
    return this;
  }

  /**
   * Get next id
   */
  get next() {
    return ++this.index;
  }

  /**
   * Get root
   */
  get root() {
    return this.config.root || '';
  }

  /**
   * Cancel a request
   */
  cancel(id = 0) {
    if (id) {
      if (!isUndefined(this.pending[id])) {
        this.pending[id].source.cancel();
        delete this.pending[id];
      }
    } else {
      keys(this.pending).forEach(this.cancel);
    }
    return this;
  }

  /**
   * Delete
   */
  delete(endpoint, config) {
    return this.request('delete', endpoint, config);
  }

  /**
   * Get
   */
  get(endpoint, config) {
    return this.request('get', endpoint, config);
  }

  /**
   * Post
   */
  post(endpoint, data, config) {
    return this.request('post', endpoint, config, data);
  }

  /**
   * Put
   */
  put(endpoint, data, config) {
    return this.request('put', endpoint, config, data);
  }

  /**
   * Remove token
   */
  removeToken() {
    cookie.remove(this.config.token || 'token');
    return this;
  }

  /**
   * Perform request
   */
  request(method, endpoint, config = {}, data = {}) {
    const args = [this.root + trimStart(endpoint, '/')];
    if (['post', 'put'].indexOf(method) >= 0) {
      args.push(data);
    }
    const id = config.id || this.next,
          source = CancelToken.source();
    config.cancelToken = source.token;
    this.pending[id] = {
      id,
      source
    };
    if (isUndefined(config.headers)) {
      config.headers = {};
    }
    if (this.token) {
      config.headers['Authorization'] = 'Bearer ' + this.token;
    }
    args.push(config);
    return axios[method](...args)
      .then((response) => {
        if (!isUndefined(this.pending[id])) {
          delete this.pending[id];
        }
        const authorization = (response.headers || {}).authorization;
        if (authorization) {
          if (this.timeouts.authorization) {
            clearTimeout(this.timeouts.authorization);
          }
          this.timeouts.authorization = setTimeout(() => {
            const colon = authorization.indexOf(':'),
                  expires = parseInt(authorization.substring(0, colon)),
                  token = authorization.substring(colon + 1);
            this.setToken(token, expires);
            this.timeouts.authorization = null;
          }, this.config.debounce.authorization || 1000);
        }
        return response.data;
      })
      .catch((exception) => {
        if (!isUndefined(this.pending[id])) {
          delete this.pending[id];
        }
        return Promise.reject(exception);
      });
  }

  /**
   * Set token
   */
  setToken(token, expires = 60 * 30) {
    cookie.set(this.config.token || 'token', token, {
      expires: expires / SECONDS_PER_DAY
    });
    return this.token = token;
  }
}
