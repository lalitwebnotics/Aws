import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import React, { Component, createRef } from 'react';

import { TYPES } from '../../../api/engine/Engine';
import { getEngineMakes } from '../../../api/engine/actions'
import { when } from '../../../store';
import { bind } from '../../../utils';
import Form from '../../popups/Form';
import Select from '../../inputs/select/Select';
import Tag from '../../inputs/tag/Tag';
import Text from '../../inputs/text/Text';
// import Upload from '../../inputs/upload/Upload';

/**
 * Engine Model Form Popup
 */
export default class EngineModelPopup extends Component {

  constructor(...args) {
    super(...args);
    this.inputs = createRef();
    
    this.state = {
      inputs: {
        _id: '',
        cylinders: '',
        engine_make: null,
        type: '',
        name: '',
        certificate: '',
        ...pick(this.props.data, [
          '_id',
          'cylinders',
          'engine_make',
          'name',
          'type',
          'certificate'
        ])
      }
    };
    bind(this, [
      'onSave',
      'updateInputs',
      'onSelectEngineMake'
    ]);
  }

  render() {
    const { action, children, title = '' } = this.props,
          { inputs } = this.state;
    return (
      <Form
        action={action}
        className="EngineModelPopup"
        inputs={inputs}
        onSave={this.onSave}
        trigger={({ show }) => (
        <span className="popup-trigger" onClick={show}>
          {children}
        </span>
      )}>
        {(popup, { data, input }) => (
          <>
            <h4>{title}</h4>
            <div className="inputs" ref={this.inputs}>
              <Text
                label="Name"
                placeholder="Enter engine model name"
                required
                {...input('name', this.updateInputs)}
              />
              <Select
                label="Type"
                options={TYPES}
                {...input('type', this.updateInputs)}
              />
              <Text
                type="cylinders"
                label="Cylinders"
                placeholder="Enter number of cylinders"
                required
                {...input('cylinders', this.updateInputs)}
              />
              <Tag
                autoComplete={{
                  top: false,
                  maxHeight: this.getAutoCompleteMaxHeight(),
                  onFetch: this.getEngineMakes,
                  placeholder: 'Search engine make'
                }}
                format={['_id', 'name']}
                label="Engine Make"
                onSelect={this.onSelectEngineMake}
                value={data.engine_make}
              />
              <Text
                label="Certificate"
                placeholder="Enter certificate"
                {...input('certificate', this.updateInputs)}
              />
              {/* <Upload max={1} /> */}
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
          'cylinders',
          'engine_make',
          'name',
          'type'
        ])
      });
    }
  }

  /**
   * AutoComplete max height
   */
  getAutoCompleteMaxHeight() {
    const inputs = this.inputs.current;
    if (!inputs) {
      return undefined;
    } else {
      return inputs.getBoundingClientRect().height - 78;
    }
  }

  /**
   * Get engine makes
   */
  getEngineMakes(name) {
    return when(getEngineMakes({
      limit: 10,
      name
    })).then(
      ({ results }) => results
    );
  }

  /**
   * On save
   */
  onSave() {
    if (isFunction(this.props.onSave)) {
      this.props.onSave();
    }
  }

  /**
   * Update Input values
   */
  updateInputs(name, value) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        [name]: value
      }
    }));
  }

  /**
   * Engine make selected
   */
  onSelectEngineMake(name, engine_make) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        engine_make
      }
    }));
  }
}
