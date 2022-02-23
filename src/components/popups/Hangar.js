import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { redirect } from '../../routes';
import { when } from '../../store';
import { bind } from '../../utils';
import { createAircraft } from '../../api/aircraft/actions';
import Confirm from './Confirm';
import './Hangar.scss';
import Icon from '../utils/Icon';

/**
 * Hangar popup
 */
export default class Hangar extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      added: false
    };
    bind(this, [
      'onConfirm'
    ]);
  }

  render() {
    return (
      <Confirm
        className="HangarPopup"
        cancel={this.getCancelButton()}
        content={this.getContent()}
        message={this.getMessage()}
        ok={this.getOkButton()}
        onConfirm={this.onConfirm}>
        {this.props.children}
      </Confirm>
    );
  }

  /**
   * Get cancel button
   */
  getCancelButton() {
    return {
      title: this.state.added ? 'Return to Search' : 'Cancel',
      variant: 'empty'
    };
  }

  /**
   * Get content
   */
  getContent() {
    if (!this.props.aircraft) {
      return <></>;
    }
    const name = [
      this.props.aircraft.aircraft_model.aircraft_make.name,
      this.props.aircraft.aircraft_model.name
    ];
    if (this.props.aircraft.year) {
      name.unshift(this.props.aircraft.year)
    }
    return (
      <div className={clsx('selected-aircraft', { added: this.state.added })}>
        <span>{name.join(' ')}</span>
        {(this.state.added ?
          <Icon value="fa-check" /> :
          <Link to="/">Change</Link>
        )}
      </div>
    )
  }

  /**
   * Get message
   */
  getMessage() {
    return this.state.added ?
      'Your aircraft has been added to the hangar, and will begin populating products compatible products.' :
      'Are you sure you want to add this plane to your hangar to start tracking related FAA-Approved products?';
  }

  /**
   * Get ok button
   */
  getOkButton() {
    return {
      title: this.state.added ? 'Go to Hangar' : 'Add to Hangar',
      variant: 'dark-blue'
    };
  }

  /**
   * On confirm
   */
  onConfirm() {
    if (this.state.added) {
      return () => {
        redirect('/hangar');
      };
    } else {
      return when(createAircraft({
        aircraft_model: this.props.aircraft.aircraft_model._id,
        ...(!this.props.aircraft.year ? {} : {
          year: this.props.aircraft.year
        })
      })).then(() => {
        this.setState({
          added: true
        });
        return false;
      });
    }
  }
}
