import React, { Component, createRef } from 'react';
import Checkbox from '../../inputs/checkbox/Checkbox';
import AsyncSelect from 'react-select/async';
import { bind } from '../../../utils';


export default class CertificateSelect extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            selected: this.props.isSelected || false,
            values: this.props.values
        }

        bind(this, [
            'toggleSelect',
            'onSelect'
        ]);
    }

     render() {
        const {label, selectLabel, placeholder, options, onChange, typeId, values} = this.props;

        return(
            <>
                <Checkbox className={'certificateCheckbox'} icon="fa-minus" value={this.state.selected} size="sm" onChange={this.toggleSelect}>
                    {label}
                </Checkbox>
                {this.state.selected &&
                    <AsyncSelect
                        label={selectLabel}
                        isMulti
                        cacheOptions
                        defaultOptions
                        placeholder={placeholder}
                        value={values}
                        loadOptions={(inputValue) => options(inputValue, {type: typeId})}
                        onChange={this.onSelect}
                    />
                }
                <br></br>
            </>
        )
    }

    toggleSelect(){
        this.setState({
            selected: !this.state.selected
        })

        if(this.state.selected){
            console.log(this.state.values)
            this.props.onChange(this.state.values, {remove:true});
            if(this.state.values > 0){
                this.setState({
                    values: []
                })
            }
        }
    }

    onSelect(values){
        const { onChange, values: existingValues } = this.props;
        this.setState({
            values
        });
        const ids = (values || []).map(val => val.value);
        const removed = existingValues.filter(val => ids.indexOf(val.value) === -1);
        onChange(values || [], false, removed);
    }
}
