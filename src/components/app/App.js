import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import pick from 'lodash/pick';
import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';

import config from '../../config';
import api from '../../api';
import routeList, { onRouteChange, routes } from '../../routes';
import { bind, listen, onScroll } from '../../utils';
import { appClick, deviceChange, initialize } from './actions';
import './App.scss';
import Loader from '../utils/loader/Loader';
import Header from '../header/Header';

/**
 * All devices
 */
export const devices = keys(config.breakpoints);

/**
 * Device count
 */
export const deviceCount = devices.length;

/**
 * Location keys
 */
export const locationKeys = [
  'pathname',
  'search'
];

/**
 * Application
 */
class App extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      home: null,
      scrolled: false
    };
    bind(this, [
      'identifyDevice',
      'onClick'
    ]);
  }

  render() {
    if (!this.props.ready) {
      return (
        <Loader />
      );
    }
    const { device } = this.props,
          { home, scrolled } = this.state,
          mdUp = (devices.indexOf(device) >= devices.indexOf('md')),
          expand = mdUp && home && !scrolled;
    return (
      <div className="App" onClick={this.onClick}>
        <Header expand={false} />
        <div className="wrapper">
          <Suspense fallback={<Loader />}>
            <Switch>
              {routes(routeList)}
            </Switch>
          </Suspense>
        </div>
      </div>
    );
  }

  /**
   * Identify device
   */
  identifyDevice() {
    const width = window.innerWidth || (document.documentElement || {}).clientWidth || this.body.clientWidth;
    for (let i = 0; i < deviceCount; i++) {
      const current = devices[i],
            next = devices[i + 1];
      if ((width >= config.breakpoints[current]) && (!next || (width < config.breakpoints[next]))) {
        if (current !== this.props.device) {
          this.props.dispatch(deviceChange(current));
        }
        break;
      }
    }
  }

  componentDidMount() {
    this.body = document.getElementsByTagName('body')[0];
    this.offDevice = listen(window, 'resize', this.identifyDevice);
    this.offRouter = onRouteChange(({ payload }) => {
      if (!isEqual(pick(payload.location, locationKeys), pick(this.props.router.location, locationKeys))) {
        api.cancel();
      }
    });
    this.offScroll = onScroll(({ position }) => {
      if (position > 20 && !this.state.scrolled) {
        this.setState({
          scrolled: true
        });
      } else if (position <= 20 && this.state.scrolled) {
        this.setState({
          scrolled: false
        });
      }
    });
    this.identifyDevice();
    this.props.dispatch(initialize());
  }

  componentDidUpdate(props) {
    const path = this.props.router.location.pathname;
    if ((this.state.home === null) || (path !== props.router.location.pathname)) {
      this.setState({
        home: (path === '/')
      });
    }
  }

  componentWillUnmount() {
    this.offDevice();
    this.offRouter();
    this.offScroll();
  }

  /**
   * On click
   */
  onClick(e) {
    this.props.dispatch(appClick(e));
  }
}

export default connect(
  ({ app: { device, ready }, router }) => {
    return {
      device,
      ready,
      router
    };
  }
)(App);
