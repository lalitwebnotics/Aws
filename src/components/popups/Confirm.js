import isFunction from 'lodash/isFunction';
import React, { Component } from 'react';
import clsx from 'clsx';

import { bind, call } from '../../utils';
import Popup from './Popup';
import './Confirm.scss';
import Button from '../utils/Button';
import Nl2Br from '../utils/Nl2Br';

/**
 * Confirm popup component
 */
export default class Confirm extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      busy: false
    };
    bind(this, [
      'onConfirm'
    ]);
  }

  render() {
    const { cancel = {}, children, className, content, message, ok = {} } = this.props,
          { busy } = this.state;
    return (
      <Popup className={clsx('Confirm', className)} disabled={busy} trigger={children}>
        {({ hide }) => (
          <>
            <Nl2Br tag="p">{message}</Nl2Br>
            {(content ? content : <></>)}
            <div className={clsx('buttons', { exclusive: !!ok.exclusive })}>
              {(ok.exclusive ? <></> :
                <Button variant={cancel.variant || 'dark-blue'} className="cancel" disabled={busy} onClick={hide}>
                  {cancel.title || 'Cancel'}
                </Button>
              )}
              <Button variant={ok.variant || 'empty'} className="ok" disabled={busy} onClick={call(this.onConfirm, hide)}>
                {ok.title || 'OK'}
              </Button>
            </div>
          </>
        )}
      </Popup>
    );
  }

  onConfirm(hide, e) {
    if (isFunction(this.props.onConfirm)) {
      this.setState({
        busy: true
      });
      Promise.resolve(this.props.onConfirm(e)).catch(() => null).then((complete = true) => {
        this.setState({
          busy: false
        });
        if (complete !== false) {
          Promise.resolve(hide()).catch(() => null).then(() => {
            if (isFunction(complete)) {
              complete();
            }
          });
        }
      });
    }
  }
}
