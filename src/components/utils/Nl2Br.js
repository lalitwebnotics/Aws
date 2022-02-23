import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import React from 'react';

/**
 * New line to BR
 */
export default function Nl2Br({ children, className, tag }) {
  if (isUndefined(children)) {
    return <></>;
  }
  if (!isString(children)) {
    throw new Error('Content must be a string');
  }
  const Tag = tag || 'div',
        __html = children.replace(/(?:\r\n|\r|\n)/g, '<br />');
  return (
    <Tag className={className} dangerouslySetInnerHTML={{ __html }}></Tag>
  );
}
