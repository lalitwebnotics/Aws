import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import keys from 'lodash/keys';
import set from 'lodash/set';
import startCase from 'lodash/startCase';
import upperFirst from 'lodash/upperFirst';
import React, { Component } from 'react';
import clsx from 'clsx';

import { bind, deep } from '../../utils';
import { when } from '../../store';

/**
 * Error states
 */
export const errorStates = {
  badInput: 'invalid :name',
  patternMismatch: 'invalid :name format',
  rangeOverflow: ':name is too high',
  rangeUnderflow: ':name is too low',
  stepMismatch: 'invalid :name amount',
  tooLong: ':name is too long',
  tooShort: ':name is too short',
  typeMismatch: 'invalid :name format',
  valueMissing: ':name is required',
};

/**
 * Error keys
 */
export const errorKeys = keys(errorStates);

/**
 * Form component
 */
export default class Form extends Component {

  constructor(...args) {
    super(...args);
    this.unmounted = false;
    this.state = {
      busy: false,
      data: {},
      error: null,
      errors: {},
      focus: {}
    };
    bind(this, [
      'onComplete',
      'onFail',
      'onSubmit',
      'onSuccess',
      'setData',
      'setValue'
    ]);
  }

  render() {
    const { children, className } = this.props,
          { busy, errors } = this.state;
    return (
      <form className={clsx('Form', className, { busy, error: !isEmpty(errors) })} onSubmit={this.onSubmit}>
        {isFunction(children) ? children(this.getArguments()) : children}
      </form>
    );
  }

  componentDidMount() {
    if (!isEmpty(this.props.inputs)) {
      this.setState({
        data: this.props.inputs
      });
    }
  }

  componentDidUpdate(props) {
    if (this.props.inputs !== props.inputs) {
      this.setState({
        data: this.props.inputs || {}
      });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  /**
   * Get form arguments
   */
  getArguments() {
    const { busy, data, error } = this.state;
    return {
      busy,
      data,
      error,
      setData: this.setData,
      setValue: this.setValue,
      input: (name, setValue) => ({
        disabled: busy,
        errors: get(this.state.errors, name),
        name,
        value: get(this.state.data, name) || '',
        onBlur: ({ target }) => {
          this.validateInput(target);
        },
        onChange: (e) => {
          const { target: { value = e, type, files } = {} } = e || {};
          (isFunction(setValue) ? setValue : this.setValue)(name, type === 'file' ? files : value);
        },
        onFocus: () => {
          if (get(this.state.focus, name) !== true) {
            set(this.state.focus, name, true);
            this.setState({
              focus: this.state.focus
            });
          }
        },
        onInput: ({ target }) => {
          this.validateInput(target);
        }
      })
    };
  }

  /**
   * On complete
   */
  onComplete(error) {
    if (isFunction(this.props.onComplete)) {
      Promise.resolve(this.props.onComplete(error)).catch(() => null).then(() => {
        this.setBusy(false);
      });
    } else {
      this.setBusy(false);
    }
  }

  /**
   * On fail
   */
  onFail(error) {
    this.setState({
      error
    });
    if (isFunction(this.props.onFail)) {
      this.props.onFail(error);
    }
    const message = get(error, 'response.data.error.message');
    if (!isString(message) && !isEmpty(message)) {
      this.setState({
        errors: message
      });
    }
    this.onComplete();
  }

  /**
   * Submit form
   */
  onSubmit(e) {
    e.preventDefault();
    this.setState({
      busy: true,
      error: null
    });
    const { data } = this.state;
    let action = null;
    if (this.props.callType === 'promise') {
      action = this.props.action(data).then((newAction) => when(newAction));
    } else if (isFunction(this.props.action)) {
      action = when(this.props.action(data));
    } else if (isFunction(this.props.onSubmit)) {
      action = this.props.onSubmit(data);
    } else {
      action = Promise.resolve();
    }
    action
      .then(this.onSuccess)
      .catch(this.onFail);
  }

  /**
   * On success
   */
  onSuccess(data) {
    if (isFunction(this.props.onSuccess)) {
      Promise.resolve(this.props.onSuccess(data)).then(() => {
        this.onComplete();
      }).catch(
        this.onComplete
      );
    } else {
      this.onComplete();
    }
  }

  /**
   * Set busy
   */
  setBusy(busy) {
    if (!this.unmounted) {
      this.setState({
        busy
      });
    }
  }

  /**
   * Set data
   */
  setData(callback) {
    return this.setState(({ data }) => ({
      data: callback(data)
    }));
  }

  /**
   * Set input value
   */
  setValue(name, value) {
    return this.setData((data) => (
      deep(data, name, value)
    ));
  }

  /**
   * Validate input
   */
  validateInput(input) {
    const name = input.name;
    if (input.validity && (get(this.state.focus, name) === true)) {
      const attr = input.attributes || {},
            messages = [],
            current = get(this.state.errors, name);
      errorKeys.forEach((key) => {
        if (input.validity[key] === true) {
          messages.push(
            upperFirst(
              errorStates[key]
                .replace(':name', (attr.caption || {}).value || startCase(name))
                .toLowerCase()
            )
          );
        }
      });
      if ((messages.length && (!current || !current.length)) ||
          (!messages.length && (current && current.length))) {
        this.setState({
          errors: set(this.state.errors, name, messages)
        });
      }
    }
  }
}

