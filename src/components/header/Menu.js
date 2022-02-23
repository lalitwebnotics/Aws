import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { bind, freeze, once } from '../../utils';
import { onRouteChange } from '../../routes';
import { menuMainToggle } from '../app/actions';
import './Menu.scss';
import Icon from '../utils/Icon';

/**
 * Menu component
 */
class Menu extends Component {

  constructor(...args) {
    super(...args);
    this.busy = false;
    this.menu = createRef();
    this.state = {
      open: false,
      active: false
    }
    bind(this, [
      'toggle'
    ]);
  }

  render() {
    const { pathname } = this.props.router.location,
          { active, open } = this.state,
          links = this.getLinks();
    return (
      <div className={clsx('Menu', { active, open })} onClick={this.toggle}>
        <div className="wrapper" onClick={freeze()} ref={this.menu}>
          <span className="close" onClick={this.toggle}>
            <Icon value="fal-times" />
          </span>
          <ul>
            <li className={clsx('menu-home', { active: (pathname === '/') })}>
              <Link to="/">Home</Link>
            </li>
            {keys(links).map((url) => (
              <li className={clsx('menu-' + url.substring(url.lastIndexOf('/') + 1), { active:
                (pathname.substring(0, url.length) === url)
              })} key={url}>
                <Link to={url}>{links[url]}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.off = onRouteChange(() => {
      if (this.props.active) {
        this.toggle();
      }
    });
  }

  componentDidUpdate(props, state) {
    if (this.props.active !== props.active) {
      if (this.props.active) {
        this.setState({
          active: true
        });
      } else {
        this.setState({
          open: false
        });
      }
    }
    if (this.state.active && this.state.active !== state.active) {
      setTimeout(() => {
        this.setState({
          open: true
        });
      });
    }
    if (!this.state.open && this.state.open !== state.open) {
      this.busy = true;
      once(this.menu.current, 'transitionend').then(() => {
        this.busy = false;
        this.setState({
          active: false
        });
      });
    }
  }

  componentWillUnmount() {
    this.off();
  }

  /**
   * Get links
   */
  getLinks() {
    const { auth, device } = this.props;
    if (isEmpty(auth.data)) {
      return {
        // '/': (
        //   <span>Login</span>
        // ),
      };
    } else {
      return {
        '/logout': (
          <span>Logout</span>
        ),
        '/account': (
          <span>My Account</span>
        ),
        ...((auth.data.role !== 'admin') ? {} : {
          '/inventory': (
            <span>Inventory</span>
          )
        })
      };
    }
  }

  /**
   * Toggle hamburger
   */
  toggle() {
    if (this.busy) {
      return;
    }
    this.props.dispatch(menuMainToggle());
  }
}

export default connect(({ api: { aircraft, user }, app, router }) => {
  return {
    active: app.menu.main,
    auth: user.auth,
    device: app.device,
    router
  };
})(Menu);
