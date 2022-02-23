import keys from 'lodash/keys';
import pick from 'lodash/pick';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { bind } from '../../utils';
import './Account.scss';
import Icon from '../utils/Icon';
import Form from '../utils/Form';
import Select from '../inputs/select/Select';
import Text from '../inputs/text/Text';
import {
  updateAccount,
} from '../../api/user/actions';

/**
 * Subscriptions
 */
export const subscriptions = {
  none: 'None',
  daily: 'Once a day',
  weekly: 'Once a week',
  monthly: 'Once a month'
};

/**
 * Account component
 */
class Account extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      inputs: {
        email: '',
        name: '',
        phone: '',
        subscription: '',
        _id: ''
      }
    };
    bind(this, [
      'onSubmit'
    ]);
  }

  render() {
    const { inputs } = this.state;
    return (
      <div className="Account">
        <div className="header">
          <h2>Mac Speed&apos;s Profile</h2>
        </div>
        <div className="content">
          <div className="photo">
            <div className="image" style={{ backgroundImage: 'url("/assets/images/man-at-sunset.jpg")' }}></div>
            <span className="change">
              <Icon value="fa-camera" />
              <span>Change</span>
            </span>
          </div>
          <Form onSubmit={this.onSubmit}  action={updateAccount} inputs={inputs}>
            {({ input }) => (
              <>
                <input type="hidden" {...input('_id')} />
                <Text label="Full Name" {...input('name')} placeholder="Enter full name">
                  <Icon className="edit" value="fa-pen" />
                </Text>
                <Text label="Phone" {...input('phone')} placeholder="No number listed (add your number for text-alerts)" type="tel" />
                <Text label="Email" {...input('email')} placeholder="Enter email address" type="email" />
                <Select label="Receive Email Updates" {...input('subscription')} options={subscriptions} />
                <button type="submit" variant="dark-blue" class="Button btn btn-dark-blue save">Save</button>
              </>
            )}
          </Form>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.updateInputs(this.props.user.data);
  }

  componentDidUpdate(props) {
    const { data } = this.props.user;
    if (data !== props.user.data) {
      this.updateInputs(data);
    }
  }

  /**
   * Update inputs
   */
  updateInputs(inputs) {
    this.setState((state) => ({
      inputs: {
        ...state.inputs,
        ...pick(inputs, keys(state.inputs))
      }
    }));
  }

  /**
   * Save profile
   */
  onSubmit() {
    console.log('asd');
  }
}

export default connect(({ api: { user } }) => {
  return {
    user: user.auth
  };
})(Account);
