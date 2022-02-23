import isFunction from 'lodash/isFunction';
import kebabCase from 'lodash/kebabCase';
import keys from 'lodash/keys';
import React, { Component } from 'react';
import clsx from 'clsx';

import { bind, call } from '../../utils';
import './Accordion.scss';
import Icon from '../utils/Icon';

/**
 * Accordion component
 */
export default class Accordion extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      active: []
    };
    bind(this, [
      'toggle'
    ]);
  }

  render() {
    const { children } = this.props,
          { active } = this.state,
          items = children(),
          names = keys(items);
    return (
      <div className="Accordion">
        <ul>
          {names.map((name) => (
            <li key={name} className={clsx('accordion-item', kebabCase('item-' + name), { active: (active.indexOf(name) >= 0) })}>
              <div className="accordion-title" onClick={call(this.toggle, name)}>
                <span>{items[name].title}</span>
                <Icon value="fa-chevron-down" />
              </div>
              <div className="accordion-content">
                {this.getItem(items[name])}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  /**
   * Get item
   */
  getItem({ render }) {
    if (!isFunction(render)) {
      return render;
    }
    return render();
  }

  /**
   * Toggle item
   */
  toggle(name) {
    const index = this.state.active.indexOf(name),
          active = (index < 0);
    if (active && index < 0) {
      this.setState({
        active: [
          ...this.state.active,
          name
        ]
      });
    } else if (!active && index >= 0) {
      this.setState({
        active: [
          ...this.state.active.slice(0, index),
          ...this.state.active.slice(index + 1)
        ]
      });
    }
  }
}
