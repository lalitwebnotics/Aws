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

import config from '../../../config/index'


/**
 * Category Form Popup
 */
export default class RetailerProductPopup extends Component {

  constructor(...args) {
    super(...args);
    this.inputs = createRef();
    this.state = {
      inputs: {
        _id: '',
        retailer: null,
        product: null,
        price: 0,
        product_url: '',
        ...pick(this.props.data, [
          '_id',
          'retailer',
          'product',
          'price',
          'product_url'
        ])
      },
      imageUploadURl: config.api.root
    };
    bind(this, [
      'onSave',
      'onSelectPriceChange',
      'onSelectUrlChange',
      'onSelectProductChange'
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
                value={data.product}
              />
            </div>
          </>
        )}
      </Form>
    );
  }

  componentDidUpdate(props) {
    if (props.data !== this.props.data) {
      if (this.props.data._id) {
        this.setState({
          inputs: pick(this.props.data, [
            '_id',
            'retailer',
            'product',
            'price',
            'product_url'
          ])
        });
      }
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
  onSelectProductChange(name, product) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        product
      }
    }));
  }

}
