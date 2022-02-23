import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import React from 'react';
import clsx from 'clsx';

import './Text.scss';
import Alert from '../../utils/alert/Alert';
import Icon from '../../utils/Icon';

/**
 * Text input
 */
export default function Text(props) {
  const { children, className, errors, icon, type = 'text', placeholderLabel, value } = props,
        empty = isEmpty(value),
        label = placeholderLabel ? props.placeholder : props.label,
        input = omit(props, ['children', 'className', 'errors', 'placeholderLabel', 'reference']);
  return (
    <label className={clsx('Text', className, 'type-' + type, { empty, 'placeholder-label': placeholderLabel })}>
      {(!label ? '' :
        <span className="label">{label}</span>
      )}
      {(!icon ? '' :
        <Icon value={icon} />
      )}
      <input type={type} {...input} onChange={props.onChange} ref={props.reference} />
      {children}
      <Alert wrap={['(', ')']}>{errors}</Alert>
    </label>
  );
}
