import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import React, { Component, createRef } from 'react';
import axios from 'axios';

import { when } from '../../../store';
import { bind } from '../../../utils';
import { getManufacturers } from '../../../api/manufacturer/actions'
import Form from '../../popups/Form';
import Text from '../../inputs/text/Text';
import Select from '../../inputs/select/Select';
import Tag from '../../inputs/tag/Tag';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import config from '../../../config';
import LabelUpload from '../../utils/upload/LabelUpload';
// import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Category Form Popup
 */
export default class RebatePopup extends Component {

  constructor(...args) {
    super(...args);
    this.inputs = createRef();
    this.state = {
      inputs: {
        _id: '',
        name: '',
        amount: null,
        url: '',
        pdf: null,
        expiry_date: '',
        manufacturer: null,
        manufacturerOptions: {},
        ...pick(this.props.data, [
          '_id',
          'name',
          'amount',
          'url',
          'pdf',
          'expiry_date',
          'manufacturer',
        ])
      },
      imageUploadURl: config.api.root
    };
    bind(this, [
      'onSave',
      'onSelectManufacturer',
      'onSelectAmountChange',
      'onSelectUrlChange',
      'handlePdfUpload',
      'setStartDate',
      'onSelectExpiryDateChange',
      'onNameChange',
      'uploadPdf'
    ]);
  }

  render() {
    const { action, children, title = '' } = this.props,
      { inputs } = this.state;


    return (
      <Form
        action={action}
        className="RebatePopup"
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
                label="Rebate Name"
                placeholder="Enter rebate name"
                required
                {...input('name')}
                onChange={this.onNameChange}
              />
              <Text
                label="Amount"
                placeholder="Enter rebate amount"
                required
                type="number"
                step="any"
                {...input('amount')}
                onChange={this.onSelectAmountChange}
              />
              <Tag
                autoComplete={{
                  top: false,
                  maxHeight: this.getAutoCompleteMaxHeight(),
                  onFetch: this.getManufacturers,
                  placeholder: 'Search manufacturers'
                }}
                format={['_id', 'name']}
                label="Manufacturers"
                onSelect={this.onSelectManufacturer}
                value={data.manufacturer}
              />
              <div className="form-row">
                {data.pdf ? data.pdf.name + " " : ""}
                <LabelUpload label="Upload PDF" id="pdfUploadComponent" onUpload={this.handlePdfUpload} />
              </div>
              <Text
                label="Url"
                placeholder="Enter manufacturer website url"
                required
                {...input('url')}
                onChange={this.onSelectUrlChange}
              />
              <Text
                label="Expiry Date"
                placeholder="Enter rebate expiration date (YYYY-MM-DD format)"
                required
                {...input('expiry_date')}
                onChange={this.onSelectExpiryDateChange}
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
          'amount',
          'url',
          'pdf',
          'expiry_date',
          'manufacturer'
        ])
      });
    }
  }

  async componentDidMount() {
    this.setState({
      manufacturerOptions: await this.getManufacturers()
    })
  }

  /**
   * On save
   */
  onSave() {
    if (isFunction(this.props.onSave)) {
      this.props.onSave();
    }
    this.uploadPdf();
  }

  uploadPdf() {

    var formData = new FormData();
    let send = false;

    if (this.state.inputs.pdf) {
      formData.append("pdf", this.state.inputs.pdf);
      send = true;
    }

    if (this.state.inputs._id.length > 0) {
      formData.append("id", this.state.inputs._id)
    }

    if (send) {
      axios.post(this.state.imageUploadURl + "rebates/upload/", formData, {
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
  getManufacturers(name) {

    return when(getManufacturers({ name })).then(
      ({ results }) => results
    );
  }

  //create endpoint to post the file
  handlePdfUpload(ev) {
    let pdf = ev.target.files[0];

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        pdf
      }
    }));
  }

  /**
   * Engine make selected
   */
  onSelectManufacturer(name, manufacturer) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        manufacturer
      }
    }));
  }

  /**
   *
   */
  onSelectAmountChange(ev) {
    let amount = ev.target.value;
    console.log(amount)
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        amount
      }
    }));
  }

  /**
  *
  */
  onSelectUrlChange(ev) {
    let url = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        url
      }
    }));
  }

  /**
   *
   */
  onNameChange(ev) {
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
  onSelectExpiryDateChange(ev) {
    let expiry_date = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        expiry_date
      }
    }));
  }
}
