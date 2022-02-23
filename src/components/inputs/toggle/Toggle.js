import isFunction from 'lodash/isFunction';
import React, { Component } from 'react';
import clsx from 'clsx';

import { bind } from '../../../utils';
import './Toggle.scss';

/**
 * Toggle input
 */
export default class Toggle extends Component {

  constructor(...args) {
    super(...args);
    bind(this, [
      'toggle'
    ]);
  }

  render() {
    const { className, disabled, useDisabler = true, variant, value } = this.props;
    const classes = {
      active: value
    };
    if (useDisabler) {
      classes.disabled = disabled;
    }
    return (
      <label className={clsx('Toggle', classes, variant ? ('toggle-' + variant) : undefined, className)} onClick={this.toggle}>
        <span className="tick"></span>
      </label>
    );
  }

  toggle() {
    if (this.props.disabled) {
      return;
    }
    if (isFunction(this.props.onChange)) {
      this.props.onChange({
        target: {
          name: this.props.name,
          type: 'toggle',
          value: !this.props.value
        }
      });
    }
  }
}
