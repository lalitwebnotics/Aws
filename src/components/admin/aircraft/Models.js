import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import keys from 'lodash/keys';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { when } from '../../../store';
import { routeQuery } from '../../../routes';
import { bind, call } from '../../../utils';
import { autoRedirect } from '../utils';
import {
  getAircraftModels,
  createAircraftModel,
  deleteAircraftModel,
  updateAircraftModel
} from '../../../api/aircraft/actions';
import Checkbox from '../../inputs/checkbox/Checkbox';
import Confirm from '../../popups/Confirm';
import Filters from '../Filters';
import Icon from '../../utils/Icon';
import Paginate from '../../paginate/Paginate';
import Table from '../../table/Table';
import AircraftModelPopup from './ModelPopup'

import {
  aircraft as AircraftDataService,
  engine as EngineDataService
} from '../../../api/index'

/**
 * Sort fields
 */
export const sortFields = {
  name: 'Name',
  turbo: 'Turbo'
};

/**
 * Sort keys
 */
export const sortKeys = keys(sortFields);

/**
 * Admin Aircraft Models
 */
class AircraftModels extends Component {

  constructor(...args) {
    super(...args);

    this.state = {
      aircraftMakeAutocomplete: [],
      enginesAutocomplete: [],
    };

    bind(this, [
      'delete',
      'query'
    ]);
  }

  render() {
    const { models, route } = this.props;

    return (
      <div className="AircraftModels">
        <Filters
          create={{
            action: createAircraftModel,
            caption: '+ Add aircraft',
            onSave: this.query,
            popup: AircraftModelPopup,
            title: 'Add aircraft',
          }}
          route={route}
        />
        <Table {...models} route={route}>
          {() => ({
            head: ({ selected, sort, toggle }) => (
              <>
                <tr>
                  <th>
                    <Checkbox icon="fa-minus" value={selected} size="sm" onChange={call(toggle, !selected)}>
                      {selected ? 'Deselect' : 'Select'} All ({this.props.models.count})
                    </Checkbox>
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <th></th>
                  {sortKeys.map((key) => (
                    <th key={key}>{sort(key, sortFields[key])}</th>
                  ))}
                  <th>Aircraft Make</th>
                  <th>Engine</th>
                  <th>Certificate</th>
                  <th>Year</th>
                  <th></th>
                </tr>
              </>
            ),
            row: (model, { odd, selected, toggle }) => {
              const { _id, certificate, certificates, aircraft_make, engine_model, name, turbo, years } = model;

              if (certificates && certificates.length > 0) {
                model.certificates = certificates.map(x => {
                  x.value = x._id;
                  x.label = x.name;
                  return x;
                });
              }
                
              return (
                <>
                  <tr className={clsx({ odd, selected })}>
                    <td>
                      <Checkbox value={selected} size="sm" onChange={call(toggle, !selected)} />
                    </td>
                    <td>
                    <AircraftModelPopup
                        action={updateAircraftModel}
                        data={model}
                        title="Edit aircraft"
                        years={Array.isArray(years) ? years[0] : years}
                        onSave={this.query}>
                        {name}
                        <Icon value="fal-edit" />
                      </AircraftModelPopup>
                    </td>
                    <td>{turbo !== false ? 'Yes' : 'No'}</td>
                    <td>{aircraft_make ? aircraft_make.name : '-'}</td>
                    <td>{ engine_model ? engine_model.engine_make.name + ' - ' + engine_model.name : '-'}</td>
                    <td>{ (certificates && certificates.length > 0) ? certificates[0].name : '-'}</td>
                    <td>{Array.isArray(years) ? years[0] : years}</td>
                    <td className="delete">
                      <Confirm
                        message="Are you sure you want to delete this aircraft model?"
                        ok={{ title: 'Delete Aircraft Model' }}
                        onConfirm={call(this.delete, _id)}>
                        {({ show }) => (
                          <Icon value="fa-trash" onClick={show} />
                        )}
                      </Confirm>
                    </td>
                  </tr>
                </>
              );
            }
          })}
        </Table>
        <Paginate {...models} route={route} />
      </div>
    );
  }

  async componentDidMount() {
    this.query();
  }

  componentDidUpdate(props) {
    this.query(props);
    autoRedirect(this, 'models');
  }

  /**
   * Delete model
   */
  delete(_id) {

    when(deleteAircraftModel(_id)).
    then()
    .then(response => {
      this.props.dispatch(getAircraftModels());
    })



  }

  /**
   * Perform query
   */
  query(props) {
    const { query = {} } = this.props.route;

    if (isUndefined(props) || !isEqual(query, props.route.query)) {
      this.props.dispatch(getAircraftModels(query));
    }
  }
}

export default connect(({ api: { aircraft }, router }) => {
  return {
    models: aircraft.models,
    route: routeQuery(router)
  };
})(AircraftModels);
