import React from 'react';
import clsx from 'clsx';

import './Container.scss';

/**
 * Container component
 */
export default function Container({ children, className }) {
  return (
    <div className={clsx('Container', className)}>
      {children}
    </div>
  );
}
