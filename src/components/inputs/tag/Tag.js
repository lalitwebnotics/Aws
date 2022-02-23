import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';
import omit from 'lodash/omit';
import React, { Component, createRef } from 'react';

import { bind } from '../../../utils';
import './Tag.scss';
import AutoComplete from '../../auto-complete/AutoComplete';
import Icon from '../../utils/Icon';

/**
 * Tag input
 */
export default class Tag extends Component {

  constructor(...args) {
    super(...args);
    this.autocomplete = createRef();
    this.state = {
      value: null
    };
    bind(this, [
      'onSelect',
      'remove'
    ]);
  }

  render() {
    const { autoComplete, format, label } = this.props;
    return (
      <label className="Tag">
        {(!label ? '' :
          <span className="label">{label}</span>
        )}
        {isNil(this.state.value) ?
          <AutoComplete
            {...omit(autoComplete, [
              'format',
              'onSelect'
            ])}
            format={format}
            onSelect={this.onSelect}
            reference={this.autocomplete}
          /> :
          <span className="tag-wrapper">
            <span className="value">
              {this.format(this.state.value)}
            </span>
            <span className="remove" onClick={this.remove}>
              <Icon value="fal-times" />
            </span>
          </span>
        }
      </label>
    );
  }

  componentDidMount() {
    
    if (!isNil(this.props.value)) {
      this.setState({
        value: this.props.value
      });
    }
  }

  componentDidUpdate(props) {
    if (props.value !== this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  }

  /**
   * Format
   */
  format(value) {
    if (isNil(value)) {
      return '-';
    }
    const format = this.props.format || [],
          name = format[1];
    if (!name) {
      return value;
    }
    return value[name];
  }

  /**
   * On select
   */
  onSelect(name, value) {
    this.setState({ value }, () => {
      if (isFunction(this.props.onSelect)) {
        this.props.onSelect(name, value);
      }
    });
  }

  /**
   * Remove
   */
  remove() {
    this.setState({
      value: null
    }, () => {
      this.autocomplete.current.focus();
      if(isFunction(this.props.remove)){
        this.props.remove()
      }
    });
  }
}
