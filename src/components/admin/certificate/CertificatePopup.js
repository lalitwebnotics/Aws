import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import React, { Component, createRef } from 'react';
import csvToJson from 'csvtojson';

import { when } from '../../../store';
import {bind, permalink} from '../../../utils';
import { getProducts } from '../../../api/product/actions';
import { aircraft } from '../../../api';
import { getAircraftMakes, getAircraftModels } from '../../../api/aircraft/actions'
import Form from '../../popups/Form';
import Text from '../../inputs/text/Text';
import LabelUpload from '../../utils/upload/LabelUpload';
import Upload from "../../inputs/upload/Upload";
import Select from '../../inputs/select/Select';
import ReactSelect from 'react-select'
import AsyncSelect from 'react-select/async';
import { groupBy } from 'lodash';


import config from '../../../../src/config/index'

import axios from 'axios'

import "react-datepicker/dist/react-datepicker.css";
// import 'bootstrap/dist/css/bootstrap.min.css';

const CertificateTypes = {
  "": "Select a type",
  'STC': 'STC',
  'PMA': 'PMA',
  'TSO': 'TSO',
  'No-STC': 'No-STC',
  'TCDS': 'TCDS',
  'TCCA': 'TCCA',
  'EASA': 'EASA',
  'NORSEE': 'NORSEE',
  'Minor Alteration': 'Minor Alteration '
};

/**
 * Category Form Popup
 */
export default class CertificatePopup extends Component {

  constructor(...args) {
    super(...args);
    this.inputs = createRef();

    this.state = {
      inputs: {
        _id: '',
        name: null,
        ctype: '',
        cid: '',
        aml_name: null,
        products: [],
        aircraft_makes: [],
        aircraft_models: [],
        approved_aircraft_models: [],
        approved_aircrafts: [],
        aml_pdf: null,
        pdf: null,
        ...pick(this.props.data, [
          '_id',
          'name',
          'ctype',
          'cid',
          'aml_name',
          'products',
          'pdf',
          'aircraft_makes',
          'aircraft_models',
          'approved_aircrafts',
          'approved_aircraft_models',
          'aml_pdf'
        ])
      },
      aircraft_models_options: [],
      imageUploadURl: config.api.root
    };


    if (!this.state.aircraft_models_options.length && this.props.data && this.props.data.aircraft_makes && this.props.data.aircraft_makes.length) {
      this.handleAircraftMakeSelect(this.props.data.aircraft_makes);
    }

    bind(this, [
      'onSave',
      'onNameTextChange',
      'onSelectTypeChange',
      'onIdTextChange',
      'onLastApprovedChange',
      'onAmlNameChange',
      'onSelectProduct',
      'onSelectAmountChange',
      'onSelectUrlChange',
      'setStartDate',
      'onSelectExpiryDateChange',
      'handlePdfUpload',
      'handleAmlPdfUpload',
      'handleProductSelect',
      'handleAircraftMakeSelect',
      'handleAircraftModelSelect',
      'handleApproveAircraftModelSelect',
    ]);
  }

  render() {
    const { action, children, title = '' } = this.props,
      { inputs, aircraft_models_options, modelWhichDoNotExist } = this.state;
    return (
      <Form
        action={action}
        className="CertificatePopup"
        inputs={inputs}
        onSave={this.onSave}
        trigger={({ show }) => (
          <span className="popup-trigger" onClick={show}>
            {children}
          </span>
        )}>
        {(popup, { data, input }) => {
          const selectedMakes = groupBy(data.aircraft_makes || [], '_id');
          return (
            <>
              <h4>{title}</h4>
              <div className="inputs" ref={this.inputs}>
                <Select
                  name="ctype"
                  label="Certificate type"
                  options={CertificateTypes}
                  {...input('ctype')}
                  onChange={this.onSelectTypeChange}
                />
                <Text
                  label="Certificate ID"
                  placeholder="Enter ID name"
                  {...input('cid')}
                  onChange={this.onIdTextChange}
                />
                <Text
                  placeholder="Type name"
                  label="Certificate name"
                  {...input('name')}
                  onChange={this.onNameTextChange}
                />
                <div className="form-row">
                  {data.pdf ? data.pdf.name + " " : ""}
                  <LabelUpload label="Upload Certificate PDF" id="pdfUploadComponent" onUpload={this.handlePdfUpload} />
                </div>
                <Text
                  label="Last Approved"
                  type="date"
                  className="no-margin"
                  placeholder="Select Last Approved Date"
                  {...input('last_approved')}
                  onChange={this.onLastApprovedChange}
                />
                <h5 className="no-margin">Linked Product(s)</h5>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  defaultOptions
                  placeholder="Search.."
                  value={data.products}
                  loadOptions={this.getProducts}
                  onChange={this.handleProductSelect}
                />
                <Text
                  label="AML name"
                  className="top-margin"
                  placeholder="Enter AML name"
                  {...input('aml_name')}
                  onChange={this.onAmlNameChange}
                />
                {data.aml_pdf ? data.aml_pdf.name + " " : ""}
                <LabelUpload label="Upload AML PDF" onUpload={this.handleAmlPdfUpload} />
                <Upload
                  onUpdate={(e) => this.onFileSelect(e.target.files)}
                  disabled={this.state.uploading}
                  max={1}
                  required
                >
                  <p className="upload-area-label">Select CSV file to fill AML associations</p>
                </Upload>
                <h5 className="no-margin">AML Associations</h5>
                <AsyncSelect
                  isMulti
                  defaultOptions
                  placeholder="Aircraft Makes"
                  value={data.aircraft_makes}
                  loadOptions={this.getAircraftMakes}
                  onChange={this.handleAircraftMakeSelect}
                />
                <br />
                <ReactSelect
                  isMulti
                  name="Aircraft Model Select"
                  label="Aircraft Models"
                  options={aircraft_models_options}
                  value={inputs.aircraft_models.map((model) => {
                    return {
                      label: model.name,
                      value: model._id,
                      details: model
                    }
                  })}
                  className="basic-multi-select"
                  placeholder="Aircraft Models"
                  classNamePrefix="select"
                  onChange={this.handleAircraftModelSelect}
                />
                <br/>
                Total Selected Models {(inputs.aircraft_models || []).length} <br/> <br/>
                {(inputs.aircraft_models || []).map(model => <div key={model._id}>
                  {`${(selectedMakes[model.aircraft_make] && selectedMakes[model.aircraft_make][0] && selectedMakes[model.aircraft_make][0].label) || 'make'} ${model.name}`}
                </div>)}

                <div>---------------------------------------------------------------------------------------</div>

                Total Rejected Models {(modelWhichDoNotExist || []).length}
                {modelWhichDoNotExist && modelWhichDoNotExist.length && modelWhichDoNotExist.map((details) => <div key={details.Make}>
                  {details.Make + details.Model}
                </div>)}
                {false && <AsyncSelect
                  isMulti
                  defaultOptions
                  value={data.aircraft_models}
                  placeholder="Aircraft Models"
                  loadOptions={this.getAircraftModels}
                  onChange={this.handleAircraftModelSelect}
                />}
                {false && <br />}
                {false && <ReactSelect
                  placeholder="Approved Models"
                  options={inputs.approved_aircrafts}
                  onChange={this.handleApproveAircraftModelSelect}
                />}
              </div>
            </>
          )
        }}
      </Form>
    );
  }

  componentDidUpdate(props, prevState) {
    const { data: prevData } = props;
    const { data: currentData } = this.props;
    if (prevData !== currentData) {
      this.setState({
        inputs: pick(this.props.data, [
          '_id',
          'name',
          'ctype',
          'cid',
          'aml_name',
          'products',
          'aircraft_makes',
          'aircraft_models',
          'approved_aircraft_models',
        ])
      });
    }
  }

  async componentDidMount(props) {
  }

  /*
  * On csv file select
  * */
  onFileSelect = (files) => {
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const result = fileReader.result;

      const rows = await csvToJson().fromString(result);

      const makes = [...(new Set(rows.map(row => permalink(row.Make))))];
      const models = [...(new Set(rows.map(row => permalink(row.Model))))]
      const aircraft_makes = await this.getAircraftMakes();

      this.handleAircraftMakeSelect(aircraft_makes.filter(make => makes.indexOf(make.permalink) !== -1), models, rows);
    };

    fileReader.readAsText(files[0]);
  };

  /**
   * On save
   */
  onSave() {
    if (isFunction(this.props.onSave)) {
      this.props.onSave();
    }

    this.uploadCertificatePdf();
  }

  uploadCertificatePdf() {

    var formData = new FormData();
    let send = false;

    if (this.state.inputs.aml_pdf) {
      formData.append("aml_pdf", this.state.inputs.aml_pdf);
      send = true;
    }

    if (this.state.inputs.pdf) {
      formData.append("pdf", this.state.inputs.pdf);
      send = true;
    }

    if (this.state.inputs._id.length > 0) {
      formData.append("id", this.state.inputs._id)
    }

    if (send) {
      axios.post(this.state.imageUploadURl + "certificates/upload/", formData, {
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
   * Get products
   */
  getProducts(name = "") {
    return when(getProducts({ name: name })).then(
      ({ results }) => results.map(x => {
        var formattedProduct = {};
        formattedProduct.value = x._id;
        formattedProduct._id = x._id;
        formattedProduct.label = x.name;
        return formattedProduct;
      })
    );
  }


  /**
   * Get aircraft makes
   */
  getAircraftMakes(name = "", limit=1000) {

    return when(getAircraftMakes({ name: name, limit })).then(
      ({ results }) => results.map(x => {
        var formattedProduct = {};
        formattedProduct.value = x._id;
        formattedProduct._id = x._id;
        formattedProduct.permalink = x.permalink;
        formattedProduct.label = x.name;
        return formattedProduct;
      })
    );
  }

  handleProductSelect(products) {

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        products
      }
    }));
  }

  handleAircraftMakeSelect(aircraft_makes, models = [], rows = []) {
    const makeIds = (aircraft_makes || []).map((make) => make.value);
    let makeModelHash = {};
    aircraft.getModelsFromMakes(makeIds)
      .then((data) => {
        const options = data.map((modelOption) => {
          let makeInfo = null;
          aircraft_makes.some((makeInfoData) => {
            if(makeInfoData._id === modelOption.aircraft_make) {
              makeInfo = makeInfoData;
              return true;
            }
          });

          makeModelHash[modelOption.permalink] = true;
          return {
            value: modelOption._id,
            label: modelOption.name,
            details: modelOption,
            makeInfo
          };
        });
        data.forEach((modelOption) => {
          options[modelOption._id] = modelOption.name;
        });

        let modelWhichDoNotExist  = rows.filter((row) => {
         return !makeModelHash[permalink(row.Model)];
        });
        console.log(modelWhichDoNotExist);



        this.setState({
          aircraft_models_options: options,
          modelWhichDoNotExist
        }, () => {
          if (models instanceof Array && models.length) {
            this.handleAircraftModelSelect(options.filter(model => models.indexOf(model.details.permalink) !== -1));
          }
        })
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(this.state.inputs.aircraft_models);
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        aircraft_models: inputs.aircraft_models.filter((model) => {
          return model && makeIds.indexOf(model.aircraft_make) !== -1;
        }),
        aircraft_makes
      }
    }));
  }

  handleAircraftModelSelect(aircraft_models) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        aircraft_models: (aircraft_models || []).map((model) => model.details)
      }
    }));
  }

  handleApproveAircraftModelSelect(approved_aircraft_models) {

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        approved_aircraft_models
      }
    }));
  }

  /**
   * Get aircraft models
   */
  getAircraftModels(name = "") {
    return when(getAircraftModels({ name: name })).then(
      ({ results }) => results.map(x => {
        var formattedProduct = {};
        formattedProduct.value = x._id;
        formattedProduct._id = x._id;
        formattedProduct.label = x.name;
        return formattedProduct;
      })
    );
  }

  /**
   * Product selected
   */
  onSelectProduct(name, product) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        product
      }
    }));
  }

  onNameTextChange(ev) {
    let name = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        name
      }
    }));
  }

  onIdTextChange(ev) {
    let cid = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        cid
      }
    }));
  }

  onLastApprovedChange(ev) {
    let value = this.state.last_approved;
    if(!ev.target.value && !value) {
      return;
    }
    let last_approved = new Date(ev.target.value || value).toISOString().substr(0, 10);

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        last_approved
      }
    }));
  }

  onAmlNameChange(ev) {
    let aml_name = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        aml_name
      }
    }));
  }

  onSelectTypeChange(ev) {
    let ctype = ev.target.value;

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        ctype
      }
    }));

  }

  /**
   *
   */
  onSelectAmountChange(ev) {
    let amount = ev.target.value;

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

  handleAmlPdfUpload = ev => {
    let aml_pdf = ev.target.files[0];

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        aml_pdf
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
