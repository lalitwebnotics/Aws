import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import keys from 'lodash/keys';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';

import { routeQuery } from '../../../routes';
import { when } from '../../../store';
import { bind, call } from '../../../utils';
import { autoRedirect } from '../utils';
import {
  createAircraftMake,
  deleteAircraftMake,
  getAircraftMakes,
  updateAircraftHangar
} from '../../../api/aircraft/actions';
import AircraftMakePopup from './MakePopup';
import Checkbox from '../../inputs/checkbox/Checkbox';
import Confirm from '../../popups/Confirm';
import Filters from '../Filters';
import Icon from '../../utils/Icon';
import Paginate from '../../paginate/Paginate';
import Table from '../../table/Table';

/**
 * Sort fields
 */
export const sortFields = {
  name: 'Name'
};

/**
 * Sort keys
 */
export const sortKeys = keys(sortFields);

/**
 * Admin Aircraft Makes
 */
class AircraftMakes extends Component {

  constructor(...args) {
    super(...args);
    bind(this, [
      'delete',
      'query'
    ]);
  }

  render() {
    const { makes, route } = this.props;
    return (
      <div className="AircraftMakes">
        <Filters
          create={{
            action: createAircraftMake,
            caption: '+ Add aircraft make',
            onSave: this.query,
            popup: AircraftMakePopup,
            title: 'Add aircraft make'
          }}
          route={route}
        />
        <Table {...makes} route={route}>
          {() => ({
            head: ({ selected, sort, toggle }) => (
              <>
                <tr>
                  <th>
                    <Checkbox icon="fa-minus" value={selected} size="sm" onChange={call(toggle, !selected)}>
                      {selected ? 'Deselect' : 'Select'} All ({this.props.makes.count})
                    </Checkbox>
                  </th>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <th></th>
                  {sortKeys.map((key) => (
                    <th key={key}>{sort(key, sortFields[key])}</th>
                  ))}
                  <th></th>
                </tr>
              </>
            ),
            row: (make, { odd, selected, toggle }) => {
              const { _id, name } = make;
              return (
                <>
                  <tr className={clsx({ odd, selected })}>
                    <td>
                      <Checkbox value={selected} size="sm" onChange={call(toggle, !selected)} />
                    </td>
                    <td className="no-padding">
                      <AircraftMakePopup
                        action={updateAircraftHangar}
                        data={make}
                        title="Edit aircraft make"
                        onSave={this.query}>
                        {name}
                        <Icon value="fal-edit" />
                      </AircraftMakePopup>
                    </td>
                    <td className="delete">
                      <Confirm
                        message="Are you sure you want to delete this aircraft make?"
                        ok={{ title: 'Delete Aircraft Make' }}
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
        <Paginate {...makes} route={route} />
      </div>
    );
  }

  componentDidMount() {
    this.query();
  }

  componentDidUpdate(props) {
    this.query(props);
    autoRedirect(this, 'makes');
  }

  /**
   * Delete make
   */
  delete(_id) {
    return when(deleteAircraftMake(_id)).then(() => () => {
      this.query();
    });
  }

  /**
   * Perform query
   */
  query(props) {
    const { query = {} } = this.props.route;
    if (isUndefined(props) || !isEqual(query, props.route.query)) {
      this.props.dispatch(getAircraftMakes(query));
    }
  }
}

export default connect(({ api: { aircraft }, router }) => {
  return {
    makes: aircraft.makes,
    route: routeQuery(router)
  };
})(AircraftMakes);
