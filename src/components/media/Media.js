import pick from 'lodash/pick';
import React from 'react';

import Image from './Image';

/**
 * Media types
 */
export const types = {
  image: Image
};

/**
 * Type args
 */
export const typeArgs = {
  image: [
    'caption',
    'zoom'
  ]
};

/**
 * Media component
 */
export default function Media(props) {
  const { media } = props,
        type = media ? media.type.split('/')[0] : (props.default || 'image'),
        Type = types[type],
        args = pick(props, typeArgs[type]);
  return (
    <Type media={media} {...args} />
  );
}
