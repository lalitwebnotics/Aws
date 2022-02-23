import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utils/Icon';
import { bind } from '../../utils';
import { menuMainToggle } from '../app/actions';
import './Hamburger.scss';

/**
 * Hamburger component
 */
class Hamburger extends Component {

  constructor(...args) {
    super(...args);
    bind(this, [
      'toggle'
    ]);
  }

  render() {
    return (
      <span className="Hamburger" onClick={this.toggle}>
        <Icon value="fas-bars" />
      </span>
    );
  }

  /**
   * Toggle hamburger
   */
  toggle() {
    this.props.dispatch(menuMainToggle());
  }
}

export default connect()(Hamburger);
