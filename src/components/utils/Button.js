import isUndefined from 'lodash/isUndefined';
import omit from 'lodash/omit';
import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

/**
 * Native button
 */
export const Native = forwardRef((props, ref) => (
  <button {...omit(props, ['children'])} ref={ref}>
    {props.children}
  </button>
));

/**
 * Button component
 */
export const Button = forwardRef((props, ref) => {
  const { className, size, variant } = props,
        link = !isUndefined(props.to),
        Tag = link ? Link : Native,
        options = {};
  if (!link && isUndefined(props.type)) {
    options.type = 'button';
  }
  return (
    <Tag
      {...omit(props, ['children', 'className'])}
      {...options}
      className={clsx(
        'Button',
        'btn',
        variant ? ('btn-' + variant) : '',
        size ? ('btn-' + size) : '' ,
        className)}
      ref={ref}>
      {props.children}
    </Tag>
  );
});

export default Button;
