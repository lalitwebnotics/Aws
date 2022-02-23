import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import React, { Component, createRef } from 'react';

import { when } from '../../../store';
import { bind } from '../../../utils';
import { getProducts } from '../../../api/product/actions'
import Form from '../../popups/Form';
import Text from '../../inputs/text/Text';
import Select from '../../inputs/select/Select';
import Tag from '../../inputs/tag/Tag';
import LabelUpload from '../../utils/upload/LabelUpload'

import config from '../../../../src/config/index'
import axios from 'axios'


/**
 * Category Form Popup
 */
export default class RetailerPopup extends Component {

  constructor(...args) {
    super(...args);
    this.inputs = createRef();
    this.state = {
      inputs: {
        _id: '',
        name: '',
        logo: null,
        manufacturerOptions: {},
        ...pick(this.props.data, [
          '_id',
          'name',
          'logo',
        ])
      },
      imageUploadURl: config.api.root
    };
    bind(this, [
      'onSave',
      'onSelectPriceChange',
      'onSelectNameChange',
      'onSelectUrlChange',
      'setStartDate',
      'onSelectProductChange',
      'handleLogoUpload'
    ]);
  }

  render() {
    const { action, children, title = '' } = this.props,
      { inputs } = this.state;


    return (
      <Form
        action={action}
        className="RetailerPopup"
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
                label="Retailer Name"
                placeholder="Enter retailer name"
                required
                {...input('name')}
                onChange={this.onSelectNameChange}
              />
              {/* <Text
                label="Price"
                placeholder="Enter price"
                required
                type="number"
                step="any"
                {...input('price')}
                onChange={this.onSelectPriceChange}
              />
              <Text
                label="Product Url"
                placeholder="Enter product url"
                {...input('product_url')}
                onChange={this.onSelectUrlChange}
              />
              <Tag
                  autoComplete={{
                    top: false,
                    maxHeight: this.getAutoCompleteMaxHeight(),
                    onFetch: this.getProducts,
                    placeholder: 'Search products'
                  }}
                  format={['_id', 'name']}
                  label="Product"
                  onSelect={this.onSelectProductChange}
                  value={ data.product }
                /> */}
              {data.logo ? 'Current Logo: ' + data.logo.name : ''}
              <br />
              <LabelUpload label="Retailer Logo" id="logoUploadComponent" onUpload={this.handleLogoUpload} />
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
          'logo'
        ])
      });
    }
  }

  async componentDidMount() {
  }

  /**
   * On save
   */
  onSave() {
    if (isFunction(this.props.onSave)) {
      this.props.onSave();
    }

    this.uploadRetailerLogo();
  }

  uploadRetailerLogo() {

    var formData = new FormData();
    let send = false;

    if (this.state.inputs.logo) {
      formData.append("logo", this.state.inputs.logo);
      send = true;
    }

    if (this.state.inputs._id.length > 0) {
      formData.append("id", this.state.inputs._id)
    }

    console.log(this.state);

    if (send) {
      axios.post(this.state.imageUploadURl + "retailers/upload/", formData, {
        // receive two    parameter endpoint url ,form data
      })
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
   * Get manufacturers
   */
  getProducts(name) {

    return when(getProducts()).then(
      ({ results }) => results
    );
  }

  /**
   * Engine make selected
   */
  onSelectPriceChange(ev) {
    let price = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        price
      }
    }));
  }

  /**
   *
   */
  onSelectNameChange(ev) {
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
  onSelectUrlChange(ev) {
    let product_url = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        product_url
      }
    }));
  }

  /**
   *
   */
  setStartDate(ev) {
    let date = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        date
      }
    }));
  }

  /**
   *
   */
  onSelectProductChange(name, product) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        product
      }
    }));
  }

  handleLogoUpload(ev) {
    let logo = ev.target.files[0];

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        logo
      }
    }));
  }
}
