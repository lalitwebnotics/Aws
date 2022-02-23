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
import { getRetailers} from '../../../api/retailer/actions';
import { manufacturer as ManufacturerDataService } from '../../../api/index'
import Checkbox from '../../inputs/checkbox/Checkbox';
import Confirm from '../../popups/Confirm';
import Filters from '../Filters';
import Icon from '../../utils/Icon';
import Paginate from '../../paginate/Paginate';
import Table from '../../table/Table';
import RetailerPopup from './RetailerPopup';

import moment from 'moment'

import {
  createRetailer,
  updateRetailer,
  deleteRetailer
} from '../../../api/retailer/actions';
import { Link } from 'react-router-dom';

/**
 * Sort fields
 */
export const sortFields = {
  name: 'Name',
};

/**
 * Sort keys
 */
export const sortKeys = keys(sortFields);

/**
 * Admin Retailers
 */
class Retailers extends Component {

  constructor(...args) {
    super(...args);

    bind(this, [
      'delete',
      'query'
    ]);
  }

  render() {
    const { retailers, route } = this.props;

    return (
      <div className="Retailers">
        <Filters
          create={{
            action: createRetailer,
            caption: '+ Add retailer',
            onSave: this.query,
            popup: RetailerPopup,
            title: 'Add retailer',
          }}
          route={route}
        />
        <Table {...retailers} route={route}>
          {() => ({
            head: ({ selected, sort, toggle }) => (
              <>
                <tr>
                  <th>
                    <Checkbox icon="fa-minus" value={selected} size="sm" onChange={call(toggle, !selected)}>
                      {selected ? 'Deselect' : 'Select'} All ({this.props.retailers.count})
                    </Checkbox>
                  </th>
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
                  <th>Logo</th>
                  <th></th>
                  <th></th>
                </tr>
              </>
            ),
            row: (retailer, { odd, selected, toggle }) => {
              const { _id, name, product_url, price, product, logo } = retailer;

              return (
                <>
                  <tr className={clsx({ odd, selected })}>
                    <td>
                      <Checkbox value={selected} size="sm" onChange={call(toggle, !selected)} />
                    </td>
                    <td>
                    <RetailerPopup
                        action={updateRetailer}
                        data={retailer}
                        title="Edit retailer"
                        onSave={this.query}>
                        {name}
                        <Icon value="fal-edit" />
                      </RetailerPopup>
                    </td>
                    {/* <td>{price || '-'}</td> */}
                    {/* <td><a href={product_url} target="_blank">Product Url</a></td> */}
                    {/* <td>{ product ? product.name : "" }</td> */}
                    <td>
                      <img src={logo && logo._id ? `https://d2kijztdgb1j07.cloudfront.net/${logo.full_path}` : ''} alt={'logo'} style={{height: '20px'}} />
                    </td>
                    <td className="delete" title="products of retailer">
                      <Link to={`/inventory/product/retailers/${_id}`}><Icon value="fa-eye" /></Link>
                    </td>
                    <td className="delete">
                      <Confirm
                        message="Are you sure you want to delete this retailer?"
                        ok={{ title: 'Delete Retailer' }}
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
        <Paginate {...retailers} route={route} />
      </div>
    );
  }

  async componentDidMount() {
    this.query();
  }

  componentDidUpdate(props) {
    this.query(props);
    autoRedirect(this, 'retailers');
  }

  /**
   * Delete retailer
   */
  delete(_id) {
    when(deleteRetailer(_id)).
    then()
    .then(response => {
      this.props.dispatch(getRetailers());
    });
  }



  /**
   * Perform query
   */
  query(props) {
    const { query = {} } = this.props.route;
    if (isUndefined(props) || !isEqual(query, props.route.query)) {
      this.props.dispatch(getRetailers(query));
    }
  }
}

export default connect(({ api: { retailer }, router }) => {
  return {
    retailers: retailer.retailers,
    route: routeQuery(router)
  };
})(Retailers);
