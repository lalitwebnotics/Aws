import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import uniq from 'lodash/uniq';
import React, { Component, createRef } from 'react';

import { bind } from '../../../utils';
import Uploader from '../../utils/upload/Upload';
import './Upload.scss';

/**
 * Upload component
 */
export default class Upload extends Component {

  constructor(...args) {
    super(...args);
    this.input = createRef();
    this.ref = createRef();
    this.state = {

    };
    bind(this, [
      'onChange'
    ]);
  }

  /**
   * Acceptable file types
   */
  get accept() {
    return uniq(
      (isArray(this.props.accept) ? this.props.accept : [])
        .map((type) => trim(type))
        .filter((type) => !isEmpty(type))
    );
  }

  /**
   * Get max
   */
  get max() {
    const max = parseInt(this.props.max || '0', 10);
    return (max < 0) ? 0 : max;
  }

  render() {
    const { children } = this.props;
    return (
      <label className="Upload" ref={this.ref}>
        {children}
        <input
          type="file"
          className="file"
          accept={this.accept.join(', ')}
          multiple={(this.max !== 1)}
          onChange={this.props.onUpdate}
        />
      </label>
    );
  }

  componentDidMount() {
    this.uploader = new Uploader({
      accept: this.accept,
      max: this.max,
      path: 'media'
    });
  }

  componentWillUnmount() {
    this.uploader.destroy();
  }

  /**
   * Add files
   */
  addFiles(list = []) {
    for (let i = 0; i < list.length; i++) {
      this.uploader.add(list[i]);
    }
  }

  /**
   * On change
   */
  onChange(e) {
    this.addFiles(e.target.files);
  }
}
