import React, { Component, createRef } from 'react';
import clsx from 'clsx';

import api from '../../api';
import './Image.scss';
import Loader from '../utils/loader/Loader';

/**
 * Image component
 */
export default class Image extends Component {

  constructor(...args) {
    super(...args);
    this.image = createRef();
    this.state = {
      busy: true,
      height: 0,
      source: '',
      width: 0
    };
  }

  render() {
    const { caption, media, zoom } = this.props,
          { busy, source } = this.state;
    return (
      <div className={clsx('Image', { zoom })} ref={this.image}>
        {(busy ?
          <Loader /> :
          <>
            {(() => {
              const ratio = this.img.width / this.img.height,
                    wider = (this.state.width / this.state.height) > ratio,
                    width = (wider ? (this.state.height * ratio) : this.state.width) + 'px',
                    height = (wider ? this.state.height : (this.state.width / ratio)) + 'px';
              return (
                <img src={source} alt={media.title} style={{ width, height }} />
              );
            })()}
          </>
        )}
        {(!caption ? <></> :
          <div className="caption">{caption}</div>
        )}
      </div>
    );
  }

  componentDidMount() {
    if (this.props.media) {
      this.loadImage();
    }
  }

  componentDidUpdate(props) {
    if (this.props.media && this.props.media !== props.media) {
      this.loadImage();
    }
  }

  /**
   * Load image
   */
  loadImage() {
    const { media } = this.props;
    let source = media.full_path;
    if (!/(https\:\/\/)|(http\:\/\/)/g.test(source)) {
      source = 'https://d2kijztdgb1j07.cloudfront.net/' + source;
    }
    console.log(__dirname+source)
    this.img = document.createElement('img');
    this.img.src = source;
    this.setState({
      busy: true,
      source
    });
    if (!this.useImage()) {
      this.img.onload = () => {
        this.useImage();
      };
    }
  }

  /**
   * Use image
   */
  useImage() {
    if (!this.img.width && !this.img.height) {
      return false;
    }
    if (!this.image.current) {
      return false;
    }
    const { height, width } = this.image.current.getBoundingClientRect();
    this.setState({
      busy: false,
      height,
      width
    });
    return true;
  }
}
