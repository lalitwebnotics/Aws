import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from '../../../routes';
import './Certificates.scss';

/**
 * Admin Certificate
 */
export default class Certificate extends Component {

  render() {
    return (
      <div className="Certificate">
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
