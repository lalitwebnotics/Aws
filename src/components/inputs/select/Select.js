import isUndefined from 'lodash/isUndefined';
import keys from 'lodash/keys';
import pick from 'lodash/pick';
import React from 'react';
import clsx from 'clsx';

import './Select.scss';
import Icon from '../../utils/Icon';

/**
 * Select input
 */
export default function Select(props) {
  const { children, className, icon, label, options } = props,
        select = pick(props, ['name', 'required', 'value']);

  return (
    <label className={clsx('Select', className)}>
      {(!label ? '' :
        <span className="label">{label}</span>
      )}
      {(!icon ? '' :
        <Icon value={icon} />
      )}
      <select {...select} onChange={props.onChange}>
        {(!isUndefined ? children :
          keys(options).map((value) => (
            <option key={value} value={value} >{options[value]}</option>
          ))
        )}
      </select>
      <Icon className="caret" value="fas-caret-down" />
    </label>
  );
}
