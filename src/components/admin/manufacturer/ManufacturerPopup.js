import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import pick from 'lodash/pick';
import React, { Component } from 'react';

import { TYPES as contactTypes } from '../../../api/core/Contact';
import { bind, call } from '../../../utils';
import Alert from '../../utils/alert/Alert';
import Form from '../../popups/Form';
import Icon from '../../utils/Icon';
import Select from '../../inputs/select/Select';
import Text from '../../inputs/text/Text';

export const inputTypes = {
  email: 'email',
  mobile: 'tel',
  telephone: 'tel',
  website: 'url'
};

/**
 * Manufacturer Form Popup
 */
export default class ManufacturerPopup extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      inputs: {
        _id: '',
        address: {
          city: '',
          country: '',
          line_1: '',
          line_2: '',
          state: '',
          zip_code: ''
        },
        contacts: [],
        name: '',
        nickname: '',
        ...pick(this.props.data, [
          '_id',
          'address',
          'contacts',
          'name',
          'nickname'
        ])
      }
    };
    bind(this, [
      'addContact',
      'onContactChange',
      'onSave',
      'removeContact'
    ]);
  }

  render() {
    const { action, children, title = '' } = this.props,
          { inputs } = this.state;
    return (
      <Form
        action={action}
        className="ManufacturerPopup"
        inputs={inputs}
        onSave={this.onSave}
        trigger={({ show }) => (
        <span className="popup-trigger" onClick={show}>
          {children}
        </span>
      )}>
        {(popup, { input, data, error, setData }) => (
          <>
            <h4>{title}</h4>
            <div className="inputs">
              <Text
                label="Name"
                placeholder="Enter manufacturer name"
                required
                {...input('name')}
              />
              <Text
                className="no-margin"
                label="Nickname"
                placeholder="Enter nickname"
                {...input('nickname')}
              />
              <h5>Address Information</h5>
              <div className="form-row">
                <Text
                  label="Line 1"
                  placeholder="Enter address line 1"
                  {...input('address.line_1')}
                />
                <Text
                  label="Line 2"
                  placeholder="Enter address line 2"
                  {...input('address.line_2')}
                />
              </div>
              <div className="form-row">
                <Text
                  label="City"
                  placeholder="Enter city"
                  {...input('address.city')}
                />
                <Text
                  label="Zip code"
                  placeholder="Enter zip code"
                  {...input('address.zip_code')}
                />
              </div>
              <div className="form-row no-margin">
                <Text
                  label="State"
                  placeholder="Enter state"
                  {...input('address.state')}
                />
                <Text
                  label="Country"
                  placeholder="Enter country"
                  {...input('address.country')}
                />
              </div>
              <h5 className="no-margin">Contact Information</h5>
              {this.getContacts({ data, error, setData })}
            </div>
          </>
        )}
      </Form>
    );
  }

  componentDidMount() {
    this.setDefaultContacts();
  }

  componentDidUpdate(props) {
    if (props.data !== this.props.data) {
      this.setState({
        inputs: pick(this.props.data, [
          '_id',
          'contacts',
          'address',
          'name',
          'nickname'
        ])
      });
    }
    this.setDefaultContacts();
  }

  /**
   * Add contact
   */
  addContact({ index, setData }) {
    setData((data) => {
      const { contacts = [] } = data,
            { type } = contacts[index];
      return {
        ...data,
        contacts: [
          ...contacts.slice(0, index + 1),
          {
            type,
            value: ''
          },
          ...contacts.slice(index + 1)
        ]
      }
    });
  }

  /**
   * Get contacts
   */
  getContacts({ data, error, setData }) {
    const message = get(error, 'response.data.error.message') || {};
    return (
      <>
        {(data.contacts || []).map(({ type, value }, index) => (
          <div key={index} className="form-row contact">
            <Select
              name="type"
              options={contactTypes}
              value={type}
              onChange={call(this.onContactChange, { index, setData })}
            />
            <Text
              name="value"
              type={inputTypes[type]}
              placeholder={'Enter ' + contactTypes[type].toLowerCase()}
              value={value}
              onChange={call(this.onContactChange, { index, setData })}
            />
            <span className="actions">
              <span className="action add" onClick={call(this.addContact, { index, setData })}>
                <Icon value="fa-plus" />
              </span>
              <span className="action remove" onClick={call(this.removeContact, { index, setData })}>
                <Icon value="fa-trash" />
              </span>
            </span>
            <Alert>{message['contacts[' + index + ']']}</Alert>
          </div>
        ))}
      </>
    );
  }

  /**
   * On contact change
   */
  onContactChange({ index, setData }, { target }) {
    const { name, value } = target;
    setData((data) => {
      const { contacts = [] } = data,
            prev = contacts[index] || {};
      const changed = {
        [name]: value
      };
      // Empty value if type is changed
      if (name === 'type' && prev.type !== value) {
        changed.value = '';
      }
      return {
        ...data,
        contacts: [
          ...contacts.slice(0, index),
          {
            ...prev,
            ...changed
          },
          ...contacts.slice(index + 1)
        ]
      };
    });
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
   * Remove contact
   */
  removeContact({ index, setData }) {
    setData((data) => {
      const { contacts = [] } = data,
            insert = [];
      if (contacts.length <= 1) {
        insert.push({
          type: 'telephone',
          value: ''
        });
      }
      return {
        ...data,
        contacts: [
          ...contacts.slice(0, index),
          ...contacts.slice(index + 1),
          ...insert
        ]
      }
    });
  }

  /**
   * Default contacts always include an empty telephone number
   */
  setDefaultContacts() {
    if (!this.state.inputs.contacts.length) {
      this.setState(({ inputs }) => ({
        inputs: {
          ...inputs,
          contacts: [
            {
              type: 'telephone',
              value: ''
            }
          ]
        }
      }));
    }
  }
}
