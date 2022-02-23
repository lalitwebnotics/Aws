import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom'
import clsx from 'clsx';

import { bind } from '../../../utils';
import Form from '../../popups/Form';
import Text from '../../inputs/text/Text';
import Upload from '../../inputs/upload/Upload';
import DropzoneComponent from 'react-dropzone-component';
import Popup from '../../popups/Popup';

import config from '../../../../src/config/index'
import * as Dropzone from 'dropzone';

import {product as ProductService} from '../../../api/index'

/**
 * Image Form Popup
 */
export default class ImagePopup extends Component {

  popup;

  constructor(...args) {
    super(...args);

    this.dropzoneRef = React.createRef();

    this.state = {
      inputs: {
        _id: '',
        name: '',
        ...pick(this.props.data, [
          '_id',
          'name'
        ])
      },
      imageUploadURl : config.api.root,
      imageCDNURl : config.api.cdn_url
    };

    bind(this, [
      'onSave',
      'clearAll'
    ]);
  }

  render() {
    const { action, children, title = '', productId, media } = this.props,
          { inputs } = this.state;

    var componentConfig = {
        postUrl: this.state.imageUploadURl+'products/upload',
    };

    var djsConfig = {
      autoProcessQueue: true,
      dictDefaultMessage: "Image (Upload here)",
      params: {
        id: productId,
      },
      previewTemplate: ReactDOMServer.renderToStaticMarkup(
        <div className="dz-preview dz-file-preview">
          <div className="dz-details">
            <img data-dz-thumbnail="true" className="img-thumbnail" />
            <div className="dz-filename"><span data-dz-name="true"></span></div>
          </div>
          <div className="dz-progress"><span className="dz-upload" data-dz-uploadprogress="true"></span></div>
        </div>
      )
    }

    let imageContent = [];
    let clearAllBtnDisplay = "invisible";
    for(var i=0; i< media.length; i++){
      let src = media[i].full_path;
      if (!/(https\:\/\/)|(http\:\/\/)/g.test(src)) {
        src = this.state.imageCDNURl + src;
      }
      imageContent.push(<img src={src} className="small-img"  alt="Product image not found" />);
    }

    if(media.length > 0){
      clearAllBtnDisplay = "visible";
    }

    return (
      <Form
        action={action}
        className="ImagePopup"
        inputs={inputs}
        enctype="multipart/form-data"
        onSave={this.onSave}
        trigger={({ show }) => (
        <span className="" onClick={show}>
          {children}
        </span>
      )}>
        {(popup, { input }) => {
          this.popup = popup;
          return (
            <>
              <div>{imageContent}</div>
              <br/>
              <button type="button"  onClick={this.clearAll} className={" Button btn clear-all-btn " + clearAllBtnDisplay}>Delete All</button>
              <br/>
              <DropzoneComponent ref={this.dropzoneRef} config={componentConfig} djsConfig={djsConfig}/>
            </>
          )
        }}
      </Form>
    );
  }

  componentDidMount() {
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

  async clearAll(){
    if(this.props.productId != undefined){
      await ProductService.clearImages(this.props.productId);
      // window.location.reload(true);
      this.props.onSave();
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
