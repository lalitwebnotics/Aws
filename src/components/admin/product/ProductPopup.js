import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import React, { Component, createRef, Fragment } from 'react';

import { when } from '../../../store';
import { bind } from '../../../utils';
import { uploadMedia } from '../../../api/media/actions'
import { getManufacturers } from '../../../api/manufacturer/actions'
import { getRebates } from '../../../api/rebate/actions'
import { getRetailers } from '../../../api/retailer/actions'
import { getCertificates } from '../../../api/certificate/actions'
import Form from '../../popups/Form';
import Text from '../../inputs/text/Text';
import RichTextEditor from '../../inputs/RichTextEditor';
import Upload from '../../inputs/upload/Upload';
import Tag from '../../inputs/tag/Tag';
import CertificateSelect from './CertificateSelect'

const certificateTypes = [
  'STC',
  'TSO\'d',
  'PMA\'d',
  'TCCA',
  'EASA',
  'No-STC Associations',
  'NORSEE',
  'Minor Alteration'
];


const certificateCodes = [
  'STC',
  'TSO',
  'PMA',
  'TCCA',
  'EASA',
  'No-STC',
  'NORSEE',
  'Minor Alteration'
];



/**
 * Category Form Popup
 */
export default class ProductPopup extends Component {

  constructor(...args) {
    super(...args);
    this.inputs = createRef();
    this.state = {
      inputs: {
        _id: '',
        name: '',
        description: '',
        part: '',
        price: 0,
        certificate: '',
        certificates: [],
        media: [],
        manufacturer: null,
        rebate: null,
        // retailers: [],
        imageUrl: null,
        manufacturerOptions: {},
        ...pick(this.props.data, [
          '_id',
          'name',
          'description',
          'part',
          'price',
          'rebate',
          'certificate',
          'certificates',
          'manufacturer',
          'media'
        ])
      },
      certificatesSelected:[],
      currentType : null
    };
    bind(this, [
      'onSave',
      'onSelectManufacturer',
      'onSelectRebate',
      'customAction',
      'updateValues',
      'onSelectCertificates',
      'handleRetailersSelect'
    ]);
  }

  render() {
    const { action, children, title = '' } = this.props,
          { inputs } = this.state;

    const items = [];

    const getTumbnails = (media) => {
      const rows = [];
      if(!media || !media.length || media.map){
        return;
      }
      for(let i=0; i< media.length; i++) {
        rows.push(<img className="product-thumbnail" src={URL.createObjectURL(media[i])} alt=""/>);
      }

      return <Fragment>
        {rows}
      </Fragment>
    };

    for (const [index, value] of certificateTypes.entries()) {
      let typeId = certificateCodes[index];

      let selectedValues = []

      if (inputs.certificates) {
          selectedValues = inputs.certificates.filter(x =>  x && x.ctype == typeId);
      }

      let isSelected = selectedValues.length > 0 ? true : false;

      items.push(
        <CertificateSelect
            key={index}
            label={value}
            typeId={typeId}
            placeholder={value}
            values={selectedValues}
            options={this.getCertificates}
            onChange={this.onSelectCertificates}
            isSelected={isSelected}
        >
        </CertificateSelect>
      )
    }

    return (
      <Form
        action={this.customAction}
        className="CategoryPopup"
        callType="promise"
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
                placeholder="Enter product name"
                required
                {...input('name', this.updateValues)}
              />
              {data.media && data.media.length && data.media.map && data.media.map((image) => {
                return <img className="product-thumbnail" src={"https://d2kijztdgb1j07.cloudfront.net/" + image.full_path} alt=""/>
              })}
              {getTumbnails(data.media)}
              <Upload
                onUpdate={this.imageUpload}
                max={1}
                required
                {...input('media')}
              />
              <RichTextEditor
                {...input('description')}
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
                value={ data.manufacturer }
              />
              <Text
                label="Part"
                placeholder="Enter product part"
                required
                {...input('part', this.updateValues)}
              />
              <Text
                label="MSRP Price"
                placeholder="Enter product price"
                required
                type="number"
                step="any"
                {...input('price', this.updateValues)}
              />
              {items}
              <br/>
              <Tag
                autoComplete={{
                  top: false,
                  maxHeight: this.getAutoCompleteMaxHeight(),
                  onFetch: this.getRebates,
                  placeholder: 'Search rebates'
                }}
                format={['_id', 'name', 'amount']}
                label="Rebates"
                onSelect={this.onSelectRebate}
                remove={this.onSelectRebate}
                value={ data.rebate }
              />
              {/* <AsyncSelect
                  label="Retailers"
                  isMulti
                  cacheOptions
                  defaultOptions
                  placeholder="Retailers"
                  value={data.retailers}
                  loadOptions={this.getRetailers}
                  onChange={this.handleRetailersSelect}
                /> */}
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
          'part',
          'price',
          'certificate',
          'manufacturer',
          // 'retailers',
          'certificates'
        ])
      });
    }
  }

  async componentDidMount() {
    this.setState({
      manufacturerOptions: []
    })
  }

  async customAction(data) {
    let action = null;
    let media = [];
    const toUpdateObject = {
      ...data
    };
    if (data.media.length && data.media[0] && !data.media[0].full_path) {
      action = uploadMedia({
        media: data.media,
        for: 'products'
      });
      media = await when(action);
      toUpdateObject.media = media;
    }
    return this.props.action({...toUpdateObject});
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
  getManufacturers(name) {

    return when(getManufacturers({name: name})).then(
      ({ results }) => results
    );
  }

  /**
   * Get rebates
   */
  getRebates(name) {
    return when(getRebates()).then(
      ({ results }) => {
        return results.map(x => {
          x.rebate_name = x.manufacturer.name + " - $" + x.amount;
          return x;
        })
      }
    );
  }

  /**
   * update input values
   */
  updateValues(name, value) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        [name]: value
      }
    }));
  }

  /**
   * Manufacturer selected
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
   * Rebate selected
   */
  onSelectRebate(name, rebate) {
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        rebate
      }
    }));
  }

  /**
   * Get retailers
   */
  getRetailers(name = "") {

    return when(getRetailers({name: name})).then(
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
   * Get products
   */
  getCertificates(name = "", type = "") {
    return when(getCertificates({name: name, type: type.type})).then(
        ({ results }) => results.map(item => {
          item.value = item._id;
          item.label = item.name;
          return item;
        })
    );
  }

  handleProductSelect(retailers){

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        retailers
      }
    }));
  }

  onSelectCertificates(certificates, remove = false, removed){
    let stateCertificates = this.state.inputs.certificates;

    if(!stateCertificates){
      stateCertificates = [];
    }

    if(remove && remove.remove != undefined && certificates){
      let cIds = certificates.map(x => x._id+"");

      for (var i =0; i < stateCertificates.length; i++){
        if (stateCertificates[i] && cIds.includes(stateCertificates[i]._id)) {
          console.log('removee'+stateCertificates[i]._id)
          stateCertificates.splice(i,1);
        }
      }
    } else {
      const removedIds = removed.map(val => val.value);
      stateCertificates = stateCertificates.filter(val => removedIds.indexOf(val.value) === -1);
      const oldCerts = stateCertificates.map(val => val.value);
      const newCerts = certificates.filter(val => oldCerts.indexOf(val.value) === -1);
      stateCertificates = stateCertificates.concat(newCerts);
    }

    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        certificates: stateCertificates
      }
    }));
  }

  imageUpload = (fileData) => {
    const files = fileData.target.files;
    this.setState(({ inputs }) =>  {
      return {
        inputs: {
        ...inputs,
            media: files
        }
      }
    })
  };

  handleRetailersSelect(retailers){
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        retailers
      }
    }));
  }
}
