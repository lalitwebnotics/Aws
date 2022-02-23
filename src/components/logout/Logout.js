import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { userLogout } from '../../api/user/actions';
import './Logout.scss';
import Loader from '../utils/loader/Loader';
import Logo from '../header/Logo';

/**
 * Logout component
 */
class Logout extends Component {

  render() {
    const { busy, data } = this.props.auth;
    return (
      <div className={clsx('Logout', { busy })}>
        <div className="main expand">
          <Logo />
          {(busy && !isEmpty(data) ?
            <>
              <p>We&apos;re logging you out...</p>
              <Loader />
            </> :
            <p>
              You have logged out.<br />
              <Link to="/">Click here</Link> to login again.
            </p>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!isEmpty(this.props.auth.data)) {
      this.props.dispatch(userLogout());
    }
  }
}

export default connect(({ api: { user } }) => {
  return {
    auth: user.auth
  };
})(Logout);
