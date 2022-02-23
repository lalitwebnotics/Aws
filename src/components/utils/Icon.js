import React from 'react';
import clsx from 'clsx';

/**
 * Prefixes
 */
export const prefixes = [
  'fa',
  'fab',
  'fal',
  'fas'
];

/**
 * Icon component
 */
export default function Icon({ className, disabled, onClick, value }) {
  const arr = (value || '').split('-'),
        length = arr.length;
  if (!length) {
    throw new Error('Invalid icon value');
  }
  if (arr.length === 1) {
    arr.unshift(prefixes[0]);
  }
  if (prefixes.indexOf(arr[0]) < 0) {
    throw new Error('Invalid icon prefix: ' + arr[0]);
  }
  return (
    <i className={clsx('Icon', arr[0], arr.join('-'), className, { disabled })} onClick={onClick}></i>
  );
}
