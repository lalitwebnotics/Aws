import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from '../../../routes';
import './Aircraft.scss';

/**
 * Admin Aircraft
 */
export default class Aircraft extends Component {

  render() {
    return (
      <div className="Aircraft">
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
