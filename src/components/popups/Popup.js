import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import pick from 'lodash/pick';
import React, { Component, createRef } from 'react';
import clsx from 'clsx';

import { bind, freeze, once } from '../../utils';
import './Popup.scss';

/**
 * Popup component
 */
export default class Popup extends Component {

  constructor(...args) {
    super(...args);
    this.busy = false;
    this.popup = createRef();
    this.state = {
      active: false,
      show: false
    };
    bind(this, [
      'activate',
      'deactivate',
      'hide',
      'show'
    ]);
  }

  render() {
    const { children, className, disabled, trigger } = this.props,
          { active, show } = this.state;
    return (
      <>
        {trigger(pick(this, ['show']))}
        {(!show ? '' :
          <div className={clsx('Popup', className, { active, disabled })} ref={this.popup} onClick={this.hide}>
            <div className="popup-content" onClick={freeze(this.props.onClick)}>
              {children(pick(this, ['hide']))}
            </div>
          </div>
        )}
      </>
    );
  }

  componentDidMount() {
    if (isUndefined(this.props.trigger)) {
      throw new Error('Trigger prop must be provided');
    }
  }

  componentDidUpdate(props, { show }) {
    if (this.state.show && this.state.show !== show) {
      setTimeout(this.activate, 50);
    }
  }

  /**
   * Activate
   */
  activate() {
    this.setState({
      active: true
    });
    once(this.popup.current, 'transitionend').then(() => {
      this.busy = false;
      if (isFunction(this.props.onShow)) {
        this.props.onShow();
      }
    });
  }

  /**
   * Deactivate
   */
  deactivate() {
    this.setState({
      active: false
    });
  }

  /**
   * Hide
   */
  hide(...args) {
    if (this.busy || this.props.disabled) {
      return Promise.reject('Popup is busy or disabled');
    }
    this.busy = true;
    this.deactivate();
    return once(this.popup.current, 'transitionend').then(() => {
      this.busy = false;
      this.setState({
        show: false
      });
      if (isFunction(this.props.onHide)) {
        this.props.onHide(...args);
      }
      return this;
    });
  }

  /**
   * Show
   */
  show() {
    if (this.busy || this.props.disabled) {
      return;
    }
    this.busy = true;
    this.setState({
      show: true
    });
  }
}
