import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import pick from 'lodash/pick';
import React, { Component } from 'react';

import { redirect } from '../../routes';
import { bind, toQuery } from '../../utils';
import './Filters.scss';
import Text from '../inputs/text/Text';

/**
 * Admin filters
 */
export default class Filters extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      inputs: {
        name: ''
      }
    };
    bind(this, [
      'onChange'
    ]);
  }

  render() {
    const { create } = this.props,
          { name } = this.state.inputs;
    return (
      <div className="Filters">
        <Text
          className="keyword"
          name="name"
          value={name}
          placeholder="Search name"
          onChange={this.onChange}
        />
        {(!create ? <></> :
          <create.popup
            {...pick(create, [
              'action',
              'onSave',
              'title',
              'extra',
              'data'
            ])}>
            {create.caption}
          </create.popup>
        )}
      </div>
    );
  }

  componentDidMount() {
    const inputs = pick(this.props.route.query, keys(this.state.inputs));
    if (!isEmpty(inputs)) {
      this.setState({
        inputs
      });
    }
  }

  /**
   * On change
   */
  onChange({ target: { name, value } }) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        [name]: value
      }
    }), () => {
      this.query({
        [name]: isEmpty(value) ? false : value
      });
    });
  }

  /**
   * Query
   */
  query(inputs) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      redirect(this.props.route.path + toQuery({
        ...this.props.route.query,
        ...inputs
      }));
    }, this.props.delay || 400);
  }
}
