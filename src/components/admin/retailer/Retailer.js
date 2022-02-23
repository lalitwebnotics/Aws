import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from '../../../routes';
import './Retailer.scss';

/**
 * Admin Retailer
 */
export default class Retailer extends Component {

  render() {
    return (
      <div className="Retailer">
        <div className="sublinks">
          <ul>
            {this.props.routes.map(({ path, title }) => (
              <li key={path}>
                <NavLink exact={true} to={path}>{title}</NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="subpage">
          {routes(this.props.routes)}
        </div>
      </div>
    );
  }
}
