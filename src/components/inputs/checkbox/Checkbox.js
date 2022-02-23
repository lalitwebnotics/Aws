import isFunction from 'lodash/isFunction';
import React, { Component } from 'react';
import clsx from 'clsx';

import { bind } from '../../../utils';
import './Checkbox.scss';
import Icon from '..//../utils/Icon';

/**
 * Checkbox
 */
class Checkbox extends Component {

  constructor(...args) {
    super(...args);
    bind(this, [
      'toggle'
    ]);
  }

  render() {
    const { children, className, disabled, icon = 'fa-check', size, value } = this.props;
    return (
      <label className={clsx('Checkbox', className, { active: value, disabled }, size ? ('checkbox-' + size) : '')} onClick={this.toggle}>
        <span className="tick">
          <Icon value={icon} />
        </span>
        {(!children ? '' :
          <span className="caption">{children}</span>
        )}
      </label>
    );
  }

  /**
   * Toggle check
   */
  toggle() {
    const { onToggle, productId } = this.props; 
    if (isFunction(this.props.onChange)) {
      this.props.onChange({
        target: {
          name: this.props.name,
          type: 'checkbox',
          value: !this.props.value
        }
      });
    }

    if(onToggle !== undefined && isFunction(onToggle)){
      this.props.onToggle(productId);
    }
  }
}

export default Checkbox;
