import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import keys from 'lodash/keys';
import React, { Component, createRef } from 'react';
import clsx from 'clsx';

import { bind, call, freeze } from '../../../utils';
import { watch } from '../../../store';
import { APP_CLICK } from '../../app/actions';
import './Dropdown.scss';
import Icon from '../../utils/Icon';
import Loader from '../../utils/loader/Loader';

/**
 * Dropdown Component
 */
class Dropdown extends Component {

  constructor(...args) {
    super(...args);
    bind(this, [
      'selectItem',
      'toggleDropdown'
    ]);
    this.ref = createRef();
    this.list = createRef();
    this.state = {
      active: false,
      ref: null,
      value: null,
      values: []
    };
  }

  render() {
    const { busy, id } = this.props,
          items = this.items,
          { active, values } = this.state,
          empty = !values.length,
          noValue = (this.state.value === null);
    return (
      <div className={clsx('Dropdown', { active, empty, 'no-value': noValue }, this.props.className)} id={id} ref={this.ref}>
        <div className="dropdown-select" onClick={freeze(this.toggleDropdown)}>
          {(busy ?
            <Loader /> :
            <>
              <span>{this.label}</span>
              <Icon className="arrow" value="fas-caret-down" />
            </>
          )}
        </div>
        <div className={clsx('dropdown-items', 'position-' + this.position)}>
          <ul ref={this.list}>
            {(empty ?
              <li className="disabled italic">
                <span>{this.props.empty || 'No items available...'}</span>
              </li> :
              values.map((value) => (
                <li key={value} className={clsx({ active: (value === this.state.value) })} onClick={call(this.selectItem, value)}>
                  <span>{items[value]}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      values: keys(this.items)
    });
    this.click = watch([APP_CLICK], () => {
      this.toggleDropdown(false);
    });
    if (isFunction(this.props.onInit)) {
      this.props.onInit({
        id: this.props.id,
        toggle: this.toggleDropdown
      });
    }
  }

  componentDidUpdate({ items }) {
    if (!isEqual(this.props.items, items)) {
      this.setState({
        values: keys(this.items)
      });
    }
    if (this.props.value !== this.state.value) {
      this.setState({
        value: this.props.value
      });
    }
    if ((this.state.value !== null) && isUndefined(this.items[this.state.value])) {
      this.selectItem(null);
    }
    if (this.state.active) {
      this.scrollSelected();
    }
  }

  componentWillUnmount() {
    this.click.cancel();
  }

  /**
   * Items
   */
  get items() {
    return this.props.items || {};
  }

  /**
   * Label
   */
  get label() {
    const label = this.items[this.state.value];
    if (isUndefined(label)) {
      return this.props.placeholder || 'Select item';
    } else {
      return label;
    }
  }

  /**
   * Position
   */
  get position() {
    return this.props.position || 'center';
  }

  /**
   * Open dropdown
   */
  toggleDropdown(active = !this.state.active) {
    if (active !== this.state.active) {
      this.setState({
        active
      });
      if (active && isFunction(this.props.onOpen)) {
        this.props.onOpen(this.props.id);
      }
    }
  }

  /**
   * Scroll selected
   */
  scrollSelected(offset = -16) {
    if (this.state.value) {
      const index = this.state.values.indexOf(this.state.value),
            target = this.list.current.childNodes[index];
      if (target) {
        this.list.current.scrollTop = target.offsetTop + offset;
      }
    } else {
      this.list.current.scrollTop = 0;
    }
  }

  /**
   * Select item
   */
  selectItem(value) {
    this.setState({
      active: false,
      value
    });
    if (value !== this.state.value && isFunction(this.props.onChange)) {
      this.props.onChange({
        target: {
          name: this.props.name,
          type: 'dropdown',
          value
        }
      });
    }
  }
}

export default Dropdown;
