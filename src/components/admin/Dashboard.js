import React, { Component } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';


import { bind, call } from '../../utils';
import { product as ProductService } from '../../api/index'
import 'react-notifications/lib/notifications.css';
import './Dashboard.scss';


/**
 * Admin Dashboard
 */
export default class Dashboard extends Component {
  constructor(...args) {
    super(...args);
    bind(this, [
      'notify',
    ]);
  }

  render() {
    return (
      <div className="Dashboard">
        <div className="row">
          <div className="col-2">
          </div>
          <div className="col-10">
           <button className="btn btn-light-blue" onClick={this.notify}>Send Demo NewsLetter to this Email</button>
            <NotificationContainer/>
          </div>
        </div>
      </div>
    );
  }

  async notify(){
    await ProductService.notify()
      .then((response) => {
        NotificationManager.info('Email Sent successfully');
      })
      .catch((err) => {
        NotificationManager.error('Error', 'Please try again!', 5000);
      });
  }
}
