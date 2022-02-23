import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import keys from 'lodash/keys';
import pick from 'lodash/pick';
import React, { Component } from 'react';
import clsx from 'clsx';

import { bind, freeze } from '../../utils';
import { watch } from '../../store';
import { APP_CLICK } from '../app/actions';
import './Selector.scss';
import Icon from '../utils/Icon';
import Loader from '../utils/loader/Loader';

/**
 * Selector component
 */
export default class Selector extends Component {

  constructor(...args) {
    super(...args);
    bind(this, [
      'hide',
      'onSelect',
      'show',
      'toggle'
    ]);
    this.overlay = React.createRef();
    this.selected = React.createRef();
    this.state = {
      active: false
    };
  }

  render() {
    const { busy, children, className, data = {}, disabled, item, selected, title } = this.props,
          { active } = this.state,
          { hide, show, toggle } = this;
    return (
      <span className={clsx('Selector', className, { active, disabled })} onClick={freeze(show)}>
        {(isFunction(children) ?
          children({ hide, show, toggle }) :
          <Icon value="fas-caret-down" />
        )}
        <div className="selector-overlay" ref={this.overlay}>
          {(busy ?
            <Loader /> :
            <ul>
              {keys(data).map((key) => {
                const isActive = (key === selected),
                      caption = isFunction(item) ? item(data[key], key) : data[key];
                return (
                  <li
                    key={key}
                    className={clsx({ active: isActive })}
                    title={isFunction(title) ? title(data[key]) : caption}
                    {...(isActive ? { ref: this.selected } : {})}
                    onClick={freeze(this.onSelect, key)}>
                    {caption}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </span>
    )
  }

  componentDidMount() {
    this.click = watch([APP_CLICK], this.hide);
    if (!isUndefined(this.props.reference)) {
      this.props.reference.current = this.getReference();
    }
  }

  componentDidUpdate(props, state) {
    if (this.props.reference !== props.reference) {
      this.props.reference.current = this.getReference();
    }
    if (this.state.active) {
      if (this.props.selected && this.selected.current) {
        this.overlay.current.scrollTop = this.selected.current.offsetTop - 10;
      } else if (this.state.active !== state.active) {
        this.overlay.current.scrollTop = 0;
      }
    }
  }

  componentWillUnmount() {
    this.click.cancel();
    if (!isUndefined(this.props.reference)) {
      this.props.reference.current = null;
    }
  }

  /**
   * Get selector reference
   */
  getReference() {
    return pick(this, [
      'hide',
      'show'
    ]);
  }

  /**
   * Hide
   */
  hide() {
    this.setState({
      active: false
    });
    if (isFunction(this.props.onHide)) {
      this.props.onHide();
    }
  }

  /**
   * Select an item
   */
  onSelect(name) {
    if (isFunction(this.props.onSelect)) {
      this.props.onSelect(this.props.data[name], name);
    }
    this.hide();
  }

  /**
   * Show overlay
   */
  show() {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      active: true
    });
    if (isFunction(this.props.onShow)) {
      this.props.onShow();
    }
  }

  /**
   * Toggle
   */
  toggle() {
    return this[this.state.active ? 'hide' : 'show']();
  }
}
