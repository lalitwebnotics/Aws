import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { bind } from '../../utils';
import { when } from '../../store';
import { redirect } from '../../routes';
import { userAuthorize, userLogin } from '../../api/user/actions';
import './Login.scss';
import Alert from '../utils/alert/Alert';
import Button from '../utils/Button';
import Checkbox from '../inputs/checkbox/Checkbox';
import Column from '../grid/Column';
import Form from '../utils/Form';
import Logo from '../header/Logo';
import Row from '../grid/Row';
import Text from '../inputs/text/Text';

/**
 * Login component
 */
class Login extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      inputs: {
        password: '',
        remember: false,
        user: ''
      }
    }
    bind(this, [
      'onSubmit',
      'onSuccess'
    ]);
  }

  render() {
    const { inputs } = this.state;
    return (
      <div className="Login">
        <div className="main expand">
          <Logo />
          <Form inputs={inputs} onSubmit={this.onSubmit} onSuccess={this.onSuccess}>
            {({ busy, error, input }) => (
              <>
                <Text
                  {...input('user')}
                  autoComplete="username"
                  caption="Username or email"
                  placeholder="Username / email"
                  placeholderLabel={true}
                  required
                />
                <Text
                  {...input('password')}
                  autoComplete="current-password"
                  className="last"
                  placeholder="Password"
                  placeholderLabel={true}
                  type="password"
                  required
                />
                <Row className="options">
                  <Column count={6}>
                    <Checkbox {...input('remember')}>Remember me</Checkbox>
                  </Column>
                  <Column count={6}>
                    <Link to="/forgot-password">Forgot password?</Link>
                  </Column>
                </Row>
                <div className="buttons">
                  <Button disabled={busy} type="submit" variant="red">Login</Button>
                  <Alert position="bottom-center">{error}</Alert>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    );
  }

  /**
   * On submit
   */
  onSubmit(inputs) {
    return when(userLogin(inputs)).then(() => (
      when(userAuthorize())
    ));
  }

  /**
   * On login success
   */
  onSuccess(response) {
    redirect('/inventory');
  }
}

export default connect(() => {
  return {};
})(Login);
