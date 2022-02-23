import React from 'react';

/**
 * Contact component
 */
export default function Contact({ data = {}, placeholder = '-' }) {
  return (
    <>{data.value || placeholder || ''}</>
  );
}
