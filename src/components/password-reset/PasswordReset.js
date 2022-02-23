import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { bind } from '../../utils';
import { redirect, routeQuery } from '../../routes';
import { userPasswordReset } from '../../api/user/actions';
import './PasswordReset.scss';
import Alert from '../utils/alert/Alert';
import Button from '../utils/Button';
import Form from '../utils/Form';
import Icon from '../utils/Icon';
import Text from '../inputs/text/Text';

/**
 * PasswordReset component
 */
class PasswordReset extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      inputs: {
        password: '',
        token: '',
        user: ''
      },
      show: false,
      submitted: false
    }
    bind(this, [
      'onSubmit',
      'onSuccess',
      'togglePassword'
    ]);
  }

  render() {
    const { inputs, show, submitted } = this.state;
    return (
      <div className="PasswordReset">
        <div className="main">
          {(submitted ?
            <>
              <h2>Password Reset</h2>
              <p>You have successfully reset your password. You may now <Link to="/">login</Link> with your new credentials.</p>
            </> :
            <>
              <h2>Password Reset</h2>
              <p>You&apos;re one step away from completing your password reset. Please type in your new password.</p>
              <Form action={userPasswordReset} onSuccess={this.onSuccess} inputs={inputs}>
                {({ busy, data: { user, token }, error, input }) => (
                  <>
                    <Text
                      {...input('user')}
                      autoComplete="email"
                      disabled={!isEmpty(user)}
                      placeholder="Email"
                      type="email"
                      required
                    />
                    {(token ?
                      <input {...input('token')} type="hidden" /> :
                      <Text
                        {...input('token')}
                        autoComplete="token"
                        placeholder="Token"
                        type="password"
                        required
                      />
                    )}
                    <Text
                      {...input('password')}
                      autoComplete="current-password"
                      placeholder="New Password"
                      type={show ? 'text' : 'password'}
                      required>
                      <Icon className="show" value={'fa-eye' + (show ? '' : '-slash')} onClick={this.togglePassword} />
                    </Text>
                    <div className="buttons">
                      <Button disabled={busy} type="submit" variant="red">Submit</Button>
                      <Alert position="bottom-center">{error}</Alert>
                    </div>
                  </>
                )}
              </Form>
            </>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!isEmpty(this.props.route.query)) {
      this.setState((state) => ({
        inputs: {
          ...state.inputs,
          ...pick(this.props.route.query, [
            'user',
            'token'
          ])
        }
      }));
      redirect('/password-reset');
    }
  }

  /**
   * On success
   */
  onSuccess() {
    this.setState({
      submitted: true
    });
  }

  /**
   * Toggle password
   */
  togglePassword() {
    this.setState((state) => ({
      show: !state.show
    }));
  }
}

export default connect(({ router }) => {
  return {
    route: routeQuery(router)
  };
})(PasswordReset);
