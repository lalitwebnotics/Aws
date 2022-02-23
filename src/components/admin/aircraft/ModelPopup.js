import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import React, { Component, createRef } from 'react';

import { when } from '../../../store';
import { bind } from '../../../utils';
import Form from '../../popups/Form';
import Text from '../../inputs/text/Text';
import Select from '../../inputs/select/Select';
import Tag from '../../inputs/tag/Tag';
import AsyncSelect from 'react-select/async';

import { getCertificates } from '../../../api/certificate/actions'
import { getAircraftMakes } from '../../../api/aircraft/actions';
import { getEngineModels } from '../../../api/engine/actions';

/**
 * Aircraft Make Form Popup
 */
export default class AircraftModelPopup extends Component {

  constructor(...args) {
    super(...args);

    this.inputs = createRef();

    this.state = {
      inputs: {
        _id: '',
        name: '',
        turbo: '',
        aircraft_make: null,
        engine_model: null,
        certificates: [],
        years: this.props.years ? this.props.years : "",
        ...pick(this.props.data, [
          '_id',
          'name',
          'turbo',
          'aircraft_make',
          'engine_model',
          'certificates'
        ])
      },
      aircraft_make: {},
      data_turbo: this.props.data != undefined ? this.props.data.turbo: ""
    };
    bind(this, [
      'onSave',
      'onSelectAircraftMake',
      'handleInputChange',
      'onSelectEngineModel',
      'onSelectTurboChange',
      'onSelectNameChange',
      'onSelectYearsChange',
      'handleCertificateSelect'
    ]);
  }

  render() {
    const { action, children, title = '' } = this.props,
          { inputs } = this.state;


    let turboOptions = {
      "true": "Yes",
      "false": "No"
    };

    return (
      <Form
        action={action}
        className="AircraftModelPopup"
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
                placeholder="Enter aircraft name"
                required
                {...input('name')}
                onChange={this.onSelectNameChange}
              />
              <Tag
                autoComplete={{
                  top: false,
                  maxHeight: this.getAutoCompleteMaxHeight(),
                  onFetch: this.getAircraftMakes,
                  placeholder: 'Search aircraft makes'
                }}
                format={['_id', 'name']}
                label="Aircraft Makes"
                onSelect={this.onSelectAircraftMake}
                value={ data.aircraft_make }
              />
              <Tag
                autoComplete={{
                  top: false,
                  maxHeight: this.getAutoCompleteMaxHeight(),
                  onFetch: this.getAircraftEngines,
                  placeholder: 'Search engine'
                }}
                format={['_id', 'name']}
                label="Engine"
                onSelect={this.onSelectEngineModel}
                value={ data.engine_model}
              />
              <label className="Select" >
                <span className="label">Turbo</span>
                <select name="turbo" required="" value={this.state.data_turbo} onChange={this.onSelectTurboChange} >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                  </select>
                  <i className="Icon fas fas-caret-down caret"></i>
              </label>
              <AsyncSelect
                label="Certificates"
                isMulti
                cacheOptions
                defaultOptions
                placeholder="Certificates"
                value={data.certificates}
                loadOptions={this.getCertificates}
                onChange={this.handleCertificateSelect}
              />
              <Text
                label="Year"
                placeholder="Enter year"
                type="number"
                className="top-margin"
                {...input('years')}
                onChange={this.onSelectYearsChange}
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
          'name',
          'turbo',
          'aircraft_make',
          'engine_model',
          'certificates'
        ])
      });
    }
  }

  componentDidMount() {
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
   * Get aircraft makes
   */
  getAircraftMakes(name) {
    return when(getAircraftMakes({
      limit: 10,
      name
    })).then(
      ({ results }) => results
    );
  }

  /**
   * Get engines
   */
  getAircraftEngines(name) {
    return when(getEngineModels({
      limit: 10,
      name
    })).then(
      ({ results }) => results
    );
  }

  /**
   * Aircraft make selected
   */
  onSelectEngineModel(name, engine_model) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        engine_model
      }
    }));
  }

  /**
   * Aircraft make selected
   */
  onSelectAircraftMake(name, aircraft_make) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        aircraft_make
      }
    }));
  }

  /**
   *
   */
  onSelectNameChange(ev){
    let name = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        name
      }
    }));
  }

  /**
   *
   */
  onSelectYearsChange(ev){
    let years = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        years
      }
    }));
  }

  /**
   *
   */
  onSelectTurboChange(ev){
    let turbo = ev.target.value;
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        turbo
      }
    }));

    this.setState({
      data_turbo: turbo
    })
  }

  /**
   * Get certificates
   */
  getCertificates(name = "") {
    
    return when(getCertificates({name: name})).then(
        ({ results }) => results.map(x => {
         var formattedProduct = {}; 
         formattedProduct.value = x._id;
         formattedProduct._id = x._id;
         formattedProduct.label = x.name || x.reference;
         return formattedProduct;
      })
    );
  }

  handleCertificateSelect(certificates){
      this.setState(({ inputs }) => ({
        inputs: {
          ...inputs,
          certificates
        }
      }));
  }
}
