import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import React, { Component, createRef } from 'react';

import { when } from '../../../store';
import { bind } from '../../../utils';
import Form from '../../popups/Form';
import Text from '../../inputs/text/Text';
import Tag from '../../inputs/tag/Tag';

import { getRebates } from '../../../api/rebate/actions'

/**
 * Category Form Popup
 */
export default class CategoryPopup extends Component {

  constructor(...args) {
    super(...args);

    this.inputs = createRef();

    this.state = {
      inputs: {
        _id: '',
        name: '',
        rebate: null,
        ...pick(this.props.data, [
          '_id',
          'name',
          'rebate'
        ])
      }
    };
    bind(this, [
      'onSave',
      'onSelectNameChange',
      'onSelectRebate',
    ]);
  }

  render() {
    const { action, children, title = '' } = this.props,
          { inputs } = this.state;
    return (
      <Form
        action={action}
        className="CategoryPopup"
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
                placeholder="Enter category name"
                required
                {...input('name')}
                onChange={this.onSelectNameChange}
              />
              <Tag
                autoComplete={{
                  top: false,
                  maxHeight: this.getAutoCompleteMaxHeight(),
                  onFetch: this.getRebates,
                  placeholder: 'Search rebates'
                }}
                format={['_id', 'amount']}
                label="Rebates"
                onSelect={this.onSelectRebate}
                remove={this.onSelectRebate}
                value={ data.rebate }
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
          'name'
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
   * On save
   */
  onSave() {
    if (isFunction(this.props.onSave)) {
      this.props.onSave();
    }
  }

  /**
   * Rebate selected
   */
  onSelectRebate(name, rebate) {
    console.log(rebate)
    this.setState(({ inputs }) => ({
      inputs: {
        ...inputs,
        rebate
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
}
