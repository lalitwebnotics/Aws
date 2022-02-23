import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';
import React, { Component } from 'react';
import clsx from 'clsx';

import { bind, call, delay, setState } from '../../utils';
import './Form.scss';
import Alert from '../utils/alert/Alert';
import Button from '../utils/Button';
import Form from '../utils/Form';
import Popup from './Popup';

/**
 * Form Popup
 */
export default class FormPopup extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      busy: false,
      success: ''
    };
    bind(this, [
      'onSuccess'
    ]);
  }

  render() {
    const { buttons = {}, children, className, trigger } = this.props,
          { cancel = {}, save = {} } = buttons,
          { busy } = this.state,
          formProps = omit(this.props, ['className', 'onFail', 'onSuccess', 'trigger']);
    return (
      <Popup className={clsx('FormPopup', className)} trigger={trigger}>
        {(popup) => (

          <Form {...formProps} onSuccess={call(this.onSuccess, popup.hide)}>
            {(form) => (
              <>
                {children(popup, form)}
                <div className="buttons">
                  {(form.error ?
                    <Alert position="top-right">{form.error}</Alert> :
                    (!this.state.success ? <></> :
                      <Alert icon="fas-check-circle" position="top-right" variant="green">
                        {this.state.success}
                      </Alert>
                    )
                  )}
                  <Button
                    className="cancel"
                    disabled={form.busy || busy}
                    type="button"
                    variant={cancel.variant || 'red'}
                    onClick={popup.hide}
                  >
                    {cancel.title || 'Cancel'}
                  </Button>
                  <Button
                    className="save"
                    disabled={form.busy || busy}
                    type="submit"
                    variant={save.variant || 'dark-blue'}
                  >
                    {save.title || 'Save'}
                  </Button>
                </div>
              </>
            )}
          </Form>
        )}
      </Popup>
    );
  }

  /**
   * On success
   */
  async onSuccess(hide) {
    await setState(this, {
      success: isFunction(this.props.success) ?
        this.props.success() :
        (this.props.success || 'Saved successfully')
    });
    await delay(null, 800);
    const hidden = await hide();
    if (isFunction(this.props.onSave)) {
      await Promise.resolve(this.props.onSave());
    }
    await setState(this, {
      success: ''
    });
    return hidden;
  }
}
