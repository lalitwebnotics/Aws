import keys from 'lodash/keys';
import React from 'react';
import { Link } from 'react-router-dom';

import './Breadcrumbs.scss';
import Icon from '../utils/Icon';
import Loader from '../utils/loader/Loader';

/**
 * Breadcrumbs component
 */
export default function Breadcrumbs({ busy, links }) {
  return (
    <div className="Breadcrumbs">
      {(busy ?
        <Loader /> :
        <ul>
          {keys(links).map((key) => (
            <li key={key}>
              <Link to={key}>
                <span>{links[key]}</span>
                <Icon value="fa-chevron-right" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
