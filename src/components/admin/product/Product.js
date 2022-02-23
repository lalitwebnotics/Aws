import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { routes } from '../../../routes';
import './Product.scss';

/**
 * Admin Product
 */
export default class Product extends Component {

  render() {
    return (
      <div className="Product">
        <div className="sublinks">
          <ul>
            {this.props.routes.filter(({ id }) => id !== 'retailer-products').map(({ path, title }) => (
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
