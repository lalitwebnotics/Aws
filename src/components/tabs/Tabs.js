import keys from 'lodash/keys';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import './Tabs.scss';

/**
 * Tabs component
 */
class Tabs extends Component {

  render() {
    const { links = {}, location: { pathname } } = this.props,
          relative = pathname.substring((this.props.base || '').length);
    return (
      <div className="Tabs">
        <ul>
          {keys(links).map((path) => (
            <li className={clsx({ active: this.isActive(path, relative) })} key={path}>
              <Link to={path}>{links[path]}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  /**
   * Is active
   */
  isActive(path, pathname) {
    const relative = path.substring((this.props.base || '').length);
    if (!relative && !pathname) {
      return true;
    }
    return relative && (pathname.substring(0, relative.length) === relative);
  }
}

export default connect(({ router: { location } }) => {
  return {
    location
  };
})(Tabs);
