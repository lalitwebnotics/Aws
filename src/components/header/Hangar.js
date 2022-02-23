import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createAction } from 'redux-actions';

import { join, watch } from '../../store';
import {
  AIRCRAFT_HANGAR,
  AIRCRAFT_HANGAR_COUNT,
  getAircraftHangarCount
} from '../../api/aircraft/actions';
import './Hangar.scss';
import Icon from '../utils/Icon';

const aircraftHangarCountSuccess = createAction(join(AIRCRAFT_HANGAR_COUNT, 'SUCCESS'));

/**
 * Hangar badge
 */
class Hangar extends Component {

  render() {
    const { hangar } = this.props;
    return (
      <Link className="Hangar" to="/hangar">
        <Icon value="fas-plane" />
        <div className="arch">
          <span className="arch-left"></span>
          <span className="arch-right"></span>
        </div>
        <span className="badge">{hangar.count || 0}</span>
      </Link>
    );
  }

  componentDidMount() {
    this.props.dispatch(getAircraftHangarCount());
    this.watcher = watch([join(AIRCRAFT_HANGAR, 'SUCCESS')], ({ payload: { count } }) => {
      this.props.dispatch(aircraftHangarCountSuccess({
        count,
        results: []
      }));
    });
  }

  componentWillUnmount() {
    this.watcher.cancel();
  }
}

export default connect(({ api: { aircraft } }) => {
  return {
    hangar: aircraft.countHangar
  };
})(Hangar);
