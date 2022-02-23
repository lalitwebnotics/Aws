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
import { getRebates} from '../../../api/rebate/actions';
import { manufacturer as ManufacturerDataService } from '../../../api/index'
import Checkbox from '../../inputs/checkbox/Checkbox';
import Confirm from '../../popups/Confirm';
import Filters from '../Filters';
import Icon from '../../utils/Icon';
import Paginate from '../../paginate/Paginate';
import Table from '../../table/Table';
import RebatePopup from './RebatePopup';

import moment from 'moment'

import {
  createRebate,
  updateRebate,
  deleteRebate
} from '../../../api/rebate/actions';

/**
 * Sort fields
 */
export const sortFields = {
  manufacturer: 'Manufacturer',
  amount: 'Amount',
};

/**
 * Sort keys
 */
export const sortKeys = keys(sortFields);

/**
 * Admin Rebates
 */
class Rebates extends Component {

  constructor(...args) {
    super(...args);

    bind(this, [
      'delete',
      'query'
    ]);
  }

  render() {
    const { rebates, route } = this.props;

    return (
      <div className="Rebates">
        <Filters
          create={{
            action: createRebate,
            caption: '+ Add rebate',
            onSave: this.query,
            popup: RebatePopup,
            title: 'Add rebate',
          }}
          route={route}
        />
        <Table {...rebates} route={route}>
          {() => ({
            head: ({ selected, sort, toggle }) => (
              <>
                <tr>
                  <th>
                    <Checkbox icon="fa-minus" value={selected} size="sm" onChange={call(toggle, !selected)}>
                      {selected ? 'Deselect' : 'Select'} All ({this.props.rebates.count})
                    </Checkbox>
                  </th>
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
                  <th>Rebate Name</th>
                  <th>Pdf</th>
                  <th>Expiration Date</th>
                  <th></th>
                  <th></th>
                </tr>
              </>
            ),
            row: (rebate, { odd, selected, toggle }) => {
              const { _id, name, amount, manufacturer,url, pdf, expiry_date } = rebate;


              return (
                <>
                  <tr className={clsx({ odd, selected })}>
                    <td>
                      <Checkbox value={selected} size="sm" onChange={call(toggle, !selected)} />
                    </td>
                    <td>
                    <RebatePopup
                        action={updateRebate}
                        data={rebate}
                        title="Edit rebate"
                        onSave={this.query}>
                        {name ? name : (manufacturer ? manufacturer.name : '-')}
                        <Icon value="fal-edit" />
                      </RebatePopup>
                    </td>
                    <td>{amount || '-'}</td>
                    <td>
                      {manufacturer.name}
                      (<a href={url} target="_blank"><Icon value="fal-external-link"/></a>)
                    </td>
                    <td>{pdf && pdf._id && <a href={`https://d2kijztdgb1j07.cloudfront.net/${pdf.full_path}`} target="_blank"><Icon value="fal-pdf-0"/></a>}</td>
                    <td>{ moment(expiry_date).format('MMM DD, YYYY') }</td>
                    <td className="delete">
                      <Confirm
                        message="Are you sure you want to delete this rebate?"
                        ok={{ title: 'Delete Rebate' }}
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
        <Paginate {...rebates} route={route} />
      </div>
    );
  }

  async componentDidMount() {
    this.query();
  }

  componentDidUpdate(props) {
    this.query(props);
    autoRedirect(this, 'rebates');
  }

  /**
   * Delete rebate
   */
  delete(_id) {
    when(deleteRebate(_id)).
    then()
    .then(response => {
      this.props.dispatch(getRebates());
    });
  }



  /**
   * Perform query
   */
  query(props) {
    const { query = {} } = this.props.route;
    if (isUndefined(props) || !isEqual(query, props.route.query)) {
      this.props.dispatch(getRebates(query));
    }
  }
}

export default connect(({ api: { rebate }, router }) => {
  return {
    rebates: rebate.rebates,
    route: routeQuery(router)
  };
})(Rebates);
