import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import trim from 'lodash/trim';
import React, { Component, createRef } from 'react';
import clsx from 'clsx';

import { watch } from '../../store';
import { bind, call, freeze, getScreen, setState } from '../../utils';
import { APP_CLICK } from '../app/actions';
import './AutoComplete.scss';
import Text from '../inputs/text/Text';

/**
 * Auto Complete component
 */
export default class AutoComplete extends Component {

  constructor(...args) {
    super(...args);
    this.autocomplete = createRef();
    this.blurFocus = null;
    this.change = null;
    this.input = createRef();
    this.mounted = false;
    this.state = {
      busy: false,
      error: '',
      focus: false,
      pending: false,
      results: [],
      text: '',
      top: false,
      style: {
        overlay: {}
      }
    };
    bind(this, [
      'blur',
      'focus',
      'onBlur',
      'onChange',
      'onFocus',
      'onSelect'
    ]);
  }

  render() {
    const { busy, focus, results, style, top } = this.state,
          empty = !results.length;
    return (
      <div className={clsx('AutoComplete', { busy, empty, focus, top })} onClick={freeze()} ref={this.autocomplete}>
        {(isFunction(this.props.children) ?
          this.props.children() :
          <Text
            type="text"
            placeholder={this.props.placeholder || ''}
            reference={this.input}
            onBlur={this.onBlur}
            onChange={this.onChange}
            onFocus={this.onFocus}
            value={this.state.text}
          />
        )}
        <div className="auto-complete-overlay" style={style.overlay}>
          {(this.state.error ?
            <div className="error-message">{this.state.error}</div> :
            <ul>
              {results.map(({ name, value }) => (
                <li key={name} onClick={call(this.onSelect, name)}>{value}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.mounted = true;
    this.click = watch([APP_CLICK], this.blur);
    if (!isUndefined(this.props.reference)) {
      this.props.reference.current = this.getReference();
    }
  }

  componentWillUnmount() {
    this.click.cancel();
    this.mounted = false;
  }

  /**
   * Get max height
   */
  getMaxHeight() {
    if (!isUndefined(this.props.maxHeight)) {
      return parseInt(this.props.maxHeight);
    } else {
      const screenHeight = getScreen().height,
            autocomplete = this.autocomplete.current.getBoundingClientRect();
      return screenHeight - autocomplete.bottom - 20;
    }
  }

  /**
   * Adjust
   */
  async adjust() {
    const maxHeight = this.getMaxHeight();
    if (maxHeight < 200 && this.props.top !== false) {
      await setState(this, {
        top: true
      });
    } else {
      await setState(this, ({ style }) => ({
        top: false,
        style: {
          ...style,
          overlay: {
            maxHeight: maxHeight + 'px'
          }
        }
      }));
    }
  }


  /**
   * Blur
   */
  async blur() {
    if (!this.mounted) {
      return false;
    }
    await setState(this, {
      focus: false
    });
    if (isFunction(this.props.onBlur)) {
      this.props.onBlur();
    }
  }

  /**
   * Focus
   */
  focus() {
    this.input.current.focus();
    this.input.current.select();
  }

  /**
   * Reference
   */
  getReference() {
    return {
      focus: this.focus
    };
  }

  /**
   * On blur
   */
  onBlur() {
    clearTimeout(this.blurFocus);
    this.blurFocus = setTimeout(
      this.blur,
      this.props.delay || 200
    );
  }

  /**
   * On text change
   */
  onChange(e) {
    this.setState({
      text: trim(e.target.value || '')
    }, () => {
      clearTimeout(this.change);
      this.change = setTimeout(() => {
        this.onFetch();
      }, this.props.delay || 200);
    });
  }

  /**
   * On focus
   */
  onFocus() {
    this.setState({
      focus: true
    }, () => {
      this.adjust();
    });
  }

  /**
   * Fetch
   */
  async onFetch() {
    if (this.state.busy) {
      return await setState(this, {
        pending: true
      });
    }
    if (!this.state.text) {
      return await setState(this, {
        results: []
      });
    }
    if (isFunction(this.props.onFetch)) {
      await setState(this, {
        busy: true
      });
      try {
        const results = await this.props.onFetch(this.state.text),
              format = this.props.format || [];
        await setState(this, {
          busy: false,
          results: results.map((data, index) => ({
            data,
            name: format[0] ? data[format[0]] : index,
            value: format[1] ? data[format[1]] : data
          }))
        });
      } catch (error) {
        await setState(this, {
          busy: false,
          error: error.message || 'Unexpected error occurred'
        });
      }
      this.adjust();
      if (this.state.pending) {
        await setState(this, {
          pending: false
        });
        return this.onFetch();
      }
    }
  }

  /**
   * On select
   */
  onSelect(name) {
    this.blur().then(() => {
      if (isFunction(this.props.onSelect)) {
        this.props.onSelect(
          name,
          (this.state.results.find((item) => (
            item.name === name
          )) || {}).data
        );
      }
    });
  }
}
