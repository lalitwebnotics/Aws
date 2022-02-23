import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import React, { Component } from 'react';

import { bind } from '../../../utils';
import Form from '../../popups/Form';
import Text from '../../inputs/text/Text';

/**
 * Engine Make Form Popup
 */
export default class EngineMakePopup extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      inputs: {
        _id: '',
        name: '',
        ...pick(this.props.data, [
          '_id',
          'name'
        ])
      }
    };
    bind(this, [
      'onSave'
    ]);
  }

  render() {
    const { action, children, title = '' } = this.props,
          { inputs } = this.state;
    return (
      <Form
        action={action}
        className="EngineMakePopup"
        inputs={inputs}
        onSave={this.onSave}
        trigger={({ show }) => (
        <span className="popup-trigger" onClick={show}>
          {children}
        </span>
      )}>
        {(popup, { input }) => (
          <>
            <h4>{title}</h4>
            <div className="inputs">
              <Text
                label="Name"
                placeholder="Enter engine make name"
                required
                {...input('name')}
              />
            </div>
          </>
        )}
      </Form>
    );
  }

  componentDidUpdate(props) {
    if (props.data !== this.props.data) {
      this.setState({
        inputs: pick(this.props.data, [
          '_id',
          'name'
        ])
      });
    }
  }

  /**
   * On save
   */
  onSave() {
    if (isFunction(this.props.onSave)) {
      this.props.onSave();
    }
  }
}
