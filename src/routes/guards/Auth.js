import isArray from 'lodash/isArray';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

/**
 * User must be authenticated
 */
class Auth extends Component {

  render() {
    const { auth, children, target } = this.props,
          { role } = auth.data;
    if (target === 'none') {
      if (role) {
        return this.redirect();
      }
    } else if (target === 'any') {
      if (!role) {
        return this.redirect();
      }
    } else {
      if (isArray(target)) {
        if (target.indexOf(role) < 0) {
          return this.redirect();
        }
      } else {
        if (target !== role) {
          return this.redirect();
        }
      }
    }
    return (
      <>{children}</>
    );
  }

  /**
   * Redirect
   */
  redirect() {
    return (
      <Redirect to={this.props.redirect || '/'} />
    );
  }
}

export default connect(({ api: { user } }) => {
  return {
    auth: user.auth
  };
})(Auth);
