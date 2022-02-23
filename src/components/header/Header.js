import React, { Component } from 'react';
import clsx from 'clsx';

import './Header.scss';
import Hamburger from './Hamburger';
import Hangar from './Hangar';
import Logo from './Logo';
import Menu from './Menu';

/**
 * Header Component
 */
class Header extends Component {

  render() {
    return (
      <div className={clsx('Header', { expand: this.props.expand })}>
        <Hamburger />
        <Logo />
        {/* <Hangar /> */}
        <Menu />
      </div>
    )
  }
}

export default Header;
