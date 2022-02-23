import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bind } from '../../utils';
import { when } from '../../store';
import { userPasswordReset } from '../../api/user/actions';
import './ForgotPassword.scss';
import Alert from '../utils/alert/Alert';
import Button from '../utils/Button';
import Form from '../utils/Form';
import Text from '../inputs/text/Text';

/**
 * ForgotPassword component
 */
class ForgotPassword extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      inputs: {
        user: ''
      },
      submitted: false
    }
    bind(this, [
      'onSubmit',
      'onSuccess',
      'reset'
    ]);
  }

  render() {
    const { inputs, submitted } = this.state;
    return (
      <div className="ForgotPassword">
        <div className="main">
          {(submitted ?
            <>
              <h2>Reset Your Password</h2>
              <p>We have sent a reset password email to <strong>{inputs.user}</strong>. Please click the reset password link to set your new password.</p>
              <p>
                Didn&apos;t receive the email yet?<br />
                Please check your spam folder, or <span className="link" onClick={this.reset}>resend</span> the email.
              </p>
            </> :
            <>
              <h2>Forgot your password?</h2>
              <p>Don&apos;t worry. Resetting your password is easy, just tell us the email address you registered with Aircraft Upgrade.</p>
              <Form onSubmit={this.onSubmit} onSuccess={this.onSuccess} inputs={inputs}>
                {({ busy, error, input }) => (
                  <>
                    <Text {...input('user')} autoComplete="email" placeholder="Email" type="email" required />
                    <div className="buttons">
                      <Button disabled={busy} type="submit" variant="red">Send</Button>
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

  /**
   * On submit
   */
  onSubmit(inputs) {
    this.setState({ inputs });
    return when(userPasswordReset(inputs));
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
   * Reset
   */
  reset() {
    this.setState({
      submitted: false
    });
  }
}

export default connect(() => {
  return {};
})(ForgotPassword);
