import { bind } from '../../utils';
import omit from 'lodash/omit';

/**
 * User API
 */
export default class User {

  constructor(api) {
    this.api = api;
    bind(this, [
      'authorize',
      'login',
      'logout',
      'register',
      'resetPassword',
      'updateAccount'
    ]);
  }

  /**
   * Authorize
   */
  authorize() {
    if (!this.api.token) {
      return {};
    }
    return this.api.get('sessions/me');
  }

  /**
   * Login
   */
  login(inputs = {}) {
    return this.api.post('sessions', inputs).then(({ expires, token }) => (
      this.api.setToken(token, expires)
    ));
  }

  /**
   * Logout
   */
  logout() {
    return this.api.delete('sessions/me').then((response) => {
      this.api.removeToken();
      return response;
    });
  }

  /**
   * Register
   */
  register(inputs = {}) {
    return this.api.post('users', inputs);
  }

  /**
   * Reset password
   */
  resetPassword(inputs = {}) {
    if (inputs.user && inputs.token) {
      return this.api.put('users/password', inputs);
    } else {
      return this.api.post('users/password', {
        user: inputs.user
      });
    }
  }

  updateAccount(params = {}){
    return this.api.post('users/' + params._id + '/update-account', {
      ...omit(params, [
        '_id'
      ])
    });
  }
}
