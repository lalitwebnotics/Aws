import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import React from 'react';
import clsx from 'clsx';

import { firstString } from '../../../utils';
import './Alert.scss';
import Icon from '../Icon';

/**
 * Alert component
 */
export default function Alert({
  children,
  className,
  icon = 'fas-exclamation-circle',
  position = 'bottom-left',
  variant = 'red',
  wrap = []
}) {
  if (!children || (isArray(children) && !children.length)) {
    return (
      <></>
    );
  }
  const error = isString(children) ? children : (children[0] || children);
  let message = get(error, 'response.data.error.message') || get(error, 'message') || error;
  if (!isString(message)) {
    message = firstString(message);
  }
  if (!message) {
    return (
      <></>
    );
  }
  return (
    <span className={clsx('Alert', className, 'alert-' + position, 'alert-' + variant)}>
      <Icon value={icon} />
      <span>{wrap[0] ? wrap[0] : <></>}{message}{wrap[1] ? wrap[1] : <></>}</span>
    </span>
  );
}
