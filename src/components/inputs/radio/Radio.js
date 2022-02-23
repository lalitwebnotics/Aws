import isFunction from 'lodash/isFunction';
import React, { Component, createRef } from 'react';
import clsx from 'clsx';

import { bind } from '../../../utils';
import './Radio.scss';

/**
 * Radio component
 */
export default class Radio extends Component {

  constructor(...args) {
    super(...args);
    this.radio = createRef();
    this.state = {
      checked: false,
      ready: false
    };
    bind(this, [
      'onChange'
    ]);
  }

  render() {
    const { children, name, value } = this.props,
          { checked } = this.state,
          { onChange } = this;
    return (
      <label className={clsx('Radio', { checked })}>
        <span className="tick"></span>
        {(!children ? '' :
          <span className="caption">{children}</span>
        )}
        <span className="wrap">
          <input name={name} onChange={onChange} type="radio" value={value} ref={this.radio} />
        </span>
      </label>
    )
  }

  componentDidUpdate() {
    const { ready } = this.state;
    if (!ready && this.radio.current) {
      this.setState({
        ready: true
      });
    }
    if (ready) {
      const { selected, value } = this.props,
            checked = (selected === value);
      if (checked !== this.state.checked) {
        this.setState({
          checked
        });
      }
    }
  }

  /**
   * On change
   */
  onChange(e) {
    if (e.target.checked && isFunction(this.props.onSelect)) {
      this.props.onSelect(e);
    }
  }
}
