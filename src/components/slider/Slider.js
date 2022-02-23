import isFunction from 'lodash/isFunction';
import keys from 'lodash/keys';
import React, { Component, createRef } from 'react';
import Swiper from 'swiper';
import clsx from 'clsx';

import { bind } from '../../utils';
import './Slider.scss';
import Icon from '../utils/Icon';
import Loader from '../utils/loader/Loader';

export const itemsPerQuery = 5;
export const sliderInitialData = {
  active: true,
  busy: false,
  count: itemsPerQuery,
  items: {},
  length: 0
};
export const sliderPositions = [
  'beginning',
  'middle',
  'end'
];

/**
 * Slider component
 */
export default class Slider extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      position: -1
    };
    bind(this, [
      'onMiddle',
      'onReachBeginning',
      'onReachEnd'
    ]);
    this.next = createRef();
    this.prev = createRef();
    this.slider = createRef();
    this.swiper = null;
  }

  render() {
    const { children, className, disabled } = this.props,
          { busy, items } = this.props.data,
          { position } = this.state,
          hasChildren = isFunction(children);
    return (
      <div className={clsx('Slider', className, { busy, disabled }, 'position-' + sliderPositions[position + 1])} ref={this.slider}>
        <div className="slider-wrapper">
          {keys(items).map((key, i) => (
            <div className="slider-item" key={key}>
              {hasChildren ? children(items[key], i) : <></>}
            </div>
          ))}
          {(!this.isLoading() ? <></> :
            <div className="slider-item busy">
              <Loader />
            </div>
          )}
        </div>
        <div className="slider-prev" ref={this.prev}>
          <Icon value="fal-chevron-left" />
        </div>
        <div className="slider-next" ref={this.next}>
          <Icon value="fal-chevron-right" />
        </div>
      </div>
    );
  }

  /**
   * Is loading
   */
  isLoading() {
    return (this.props.busy || this.props.data.busy) &&
      (this.props.data.length < this.props.data.count);
  }

  componentDidMount() {
    this.swiper = new Swiper(this.slider.current, {
      freeMode: true,
      navigation: {
        nextEl: this.next.current,
        prevEl: this.prev.current
      },
      noSwipingClass: 'disabled',
      slideActiveClass: 'slider-item-active',
      slideClass: 'slider-item',
      slidesPerView: 'auto',
      spaceBetween: 10,
      wrapperClass: 'slider-wrapper'
    });
    this.swiper.on('fromEdge', this.onMiddle);
    this.swiper.on('reachBeginning', this.onReachBeginning);
    this.swiper.on('reachEnd', this.onReachEnd);
  }

  componentDidUpdate(props) {
    if (this.props.data && this.props.data !== props.data) {
      this.swiper.update();
      if (this.swiper.isBeginning) {
        this.onReachBeginning();
      }
      if (this.swiper.isEnd) {
        this.onReachEnd();
      }
    }
  }

  componentWillUnmount() {
    this.swiper.destroy();
  }

  /**
   * On middle
   */
  onMiddle() {
    this.setState({
      position: 0
    });
    if (isFunction(this.props.onMiddle)) {
      this.props.onMiddle();
    }
  }

  /**
   * On reach beginning
   */
  onReachBeginning() {
    this.setState({
      position: -1
    });
    if (isFunction(this.props.onReachBeginning)) {
      this.props.onReachBeginning();
    }
  }

  /**
   * On reach end
   */
  onReachEnd() {
    this.setState({
      position: 1
    });
    if (isFunction(this.props.onReachEnd)) {
      this.props.onReachEnd();
    }
  }
}
