import React from 'react';
import { Link } from 'react-router-dom';

import './Logo.scss';

/**
 * Logo component
 */
export default function Logo() {
  return (
    <Link className="Logo" to="/inventory">
      <div className="top">Aircraft</div>
      <div className="bottom">UPGRADE</div>
    </Link>
  );
}
