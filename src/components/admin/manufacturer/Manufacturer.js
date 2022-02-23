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
  createManufacturer,
  deleteManufacturer,
  getManufacturers,
  updateManufacturer
} from '../../../api/manufacturer/actions';
import './Manufacturer.scss';
import Address from '../../utils/Address';
import Checkbox from '../../inputs/checkbox/Checkbox';
import Confirm from '../../popups/Confirm';
import Contact from '../../utils/Contact';
import Filters from '../Filters';
import Icon from '../../utils/Icon';
import ManufacturerPopup from './ManufacturerPopup';
import Paginate from '../../paginate/Paginate';
import Table from '../../table/Table';

/**
 * Sort fields
 */
export const sortFields = {
  name: 'Name',
  nickname: 'Nickname'
};

/**
 * Sort keys
 */
export const sortKeys = keys(sortFields);

/**
 * Admin Manufacturer
 */
class Manufacturer extends Component {

  constructor(...args) {
    super(...args);
    bind(this, [
      'delete',
      'query'
    ]);
  }

  render() {
    const { manufacturers, route } = this.props;
    return (
      <div className="Manufacturer">
        <Filters
          create={{
            action: createManufacturer,
            caption: '+ Add manufacturer',
            onSave: this.query,
            popup: ManufacturerPopup,
            title: 'Add manufacturer'
          }}
          route={route}
        />
        <Table {...manufacturers} route={route}>
          {() => ({
            head: ({ selected, sort, toggle }) => (
              <>
                <tr>
                  <th>
                    <Checkbox icon="fa-minus" value={selected} size="sm" onChange={call(toggle, !selected)}>
                      {selected ? 'Deselect' : 'Select'} All ({this.props.manufacturers.count})
                    </Checkbox>
                  </th>
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
                  <th>Address</th>
                  <th>Contact</th>
                  <th></th>
                </tr>
              </>
            ),
            row: (manufacturer, { odd, selected, toggle }) => {
              const { _id, name, nickname, address, contacts = [] } = manufacturer;
              return (
                <>
                  <tr className={clsx({ odd, selected })}>
                    <td>
                      <Checkbox value={selected} size="sm" onChange={call(toggle, !selected)} />
                    </td>
                    <td className="no-padding">
                      <ManufacturerPopup
                        action={updateManufacturer}
                        data={manufacturer}
                        title="Edit manufacturer"
                        onSave={this.query}>
                        {name}
                        <Icon value="fal-edit" />
                      </ManufacturerPopup>
                    </td>
                    <td>{nickname}</td>
                    <td><Address data={address} /></td>
                    <td><Contact data={contacts[0]} /></td>
                    <td className="delete">
                      <Confirm
                        message="Are you sure you want to delete this manufacturer?"
                        ok={{ title: 'Delete Manufacturer' }}
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
        <Paginate {...manufacturers} route={route} />
      </div>
    );
  }

  componentDidMount() {
    this.query();
  }

  componentDidUpdate(props) {
    this.query(props);
    autoRedirect(this, 'manufacturers');
  }

  /**
   * Delete manufacturer
   */
  delete(_id) {
    return when(deleteManufacturer(_id)).then(() => () => {
      this.query();
    });
  }

  /**
   * Perform query
   */
  query(props) {
    const { query = {} } = this.props.route;
    if (isUndefined(props) || !isEqual(query, props.route.query)) {
      this.props.dispatch(getManufacturers(query));
    }
  }
}

export default connect(({ api: { manufacturer }, router }) => {
  return {
    manufacturers: manufacturer.manufacturers,
    route: routeQuery(router)
  };
})(Manufacturer);
