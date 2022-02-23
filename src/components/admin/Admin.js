import fromPairs from 'lodash/fromPairs';
import React, { Component } from 'react';

import { routes } from '../../routes';
import './Admin.scss';
import Tabs from '../tabs/Tabs';

/**
 * Admin
 */
export default class Admin extends Component {

  render() {
    const links = fromPairs(this.props.routes.map(({ path, title }) => [path, title]));
    return (
      <div className="Admin">
        <div className="header">
          <h2>Administration</h2>
          <Tabs base="/inventory" links={links} />
        </div>
        <div className="main">
          {routes(this.props.routes)}
        </div>
      </div>
    );
  }
}
