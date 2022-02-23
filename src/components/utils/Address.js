import trim from 'lodash/trim';
import React from 'react';

/**
 * Address component
 */
export default function Address({ data = {}, display = 'local', placeholder = '-' }) {
  const lines = [],
        fields = [];
  if (display === 'local' || display === 'full') {
    fields.push('line_1', 'line_2', 'city');
    if (display === 'full') {
      fields.push('zip_code', 'state', 'country');
    }
  } else {
    fields.push(display);
  }
  fields.forEach((field) => {
    const value = trim(data[field] || '');
    if (value) {
      lines.push(value);
    }
  });
  return (
    <>{lines.join(', ') || placeholder || ''}</>
  );
}
