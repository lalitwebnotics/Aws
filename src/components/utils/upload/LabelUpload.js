import React, { Component, createRef } from 'react';
import Icon from '../../utils/Icon';
import { bind } from '../../../utils';
import $ from 'jquery';

export default class LabelUpload extends Component {

    constructor(...args) {
        super(...args);

        this.file = createRef();

        bind(this, [
            'triggerOpenUpload',
        ]);
    }

    render(){
        const { onUpload, id, classFile = '', label } = this.props;
        return (
            <>
                <label>{label}  <Icon value="fa-upload" onClick={this.triggerOpenUpload} /> </label>
                <input type="file" style={{display:'none'}} className={classFile} ref={this.file} id={id} onChange={onUpload} />
            </>
        )
    }

    triggerOpenUpload(){
        $(this.file.current).trigger("click");
    }
}