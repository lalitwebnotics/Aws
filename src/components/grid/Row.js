import React from 'react';
import clsx from 'clsx';

import './Row.scss';

/**
 * Row component
 */
export default function Row({ children, className }) {
  return (
    <div className={clsx('Row', className)}>
      {children}
    </div>
  );
}
