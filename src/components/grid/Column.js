import React from 'react';
import clsx from 'clsx';

import './Column.scss';

/**
 * Column component
 */
export default function Column({ children, className, count = 12 }) {
  return (
    <div className={clsx('Column', className, 'col-' + count)}>
      {children}
    </div>
  );
}
