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
import { getRetailer } from '../../../api/retailer/actions';
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
  deleteRetailer
} from '../../../api/retailer/actions';
import { postRetailerProduct, putRetailerProduct, getProductsForRetailer, deleteRetailerProduct } from '../../../api/retailer_products/actions';
import { Link } from 'react-router-dom';
import RetailerProductPopup from './RetailerProductPopup';

/**
 * Sort fields
 */
export const sortFields = {
  name: 'Name',
  price: 'Price'
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
    const { products, retailerDetails: { data: retailerDetails = {} } = {}, route, match: { params: { retailer_id: retailer = null } = {} } = {} } = this.props;

    return (
      <div className="Retailers">
        <div class="Filters">
          <Link to="/inventory/product/retailers" style={{fontSize: '20px'}}>
            <Icon value="fa-chevron-left" />
          </Link>
          {retailerDetails.logo && retailerDetails.logo._id && <img src={`https://d2kijztdgb1j07.cloudfront.net/${retailerDetails.logo.full_path}`} alt={'logo'} style={{height: '20px'}} />}
          <p><strong>{retailerDetails.name}</strong></p>
        </div>
        <Filters
          create={{
            action: postRetailerProduct,
            caption: '+ Add Product',
            data: { retailer },
            onSave: this.query,
            popup: RetailerProductPopup,
            title: 'Add Product',
          }}
          route={route}
        />
        <Table {...products} route={route}>
          {() => ({
            head: ({ selected, sort, toggle }) => (
              <>
                <tr>
                  <th>
                    <Checkbox icon="fa-minus" value={selected} size="sm" onChange={call(toggle, !selected)}>
                      {selected ? 'Deselect' : 'Select'} All ({this.props.products.count})
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
                  <th>Product Url</th>
                  <th></th>
                </tr>
              </>
            ),
            row: (productObj, { odd, selected, toggle }) => {
              const { _id, retailer, product_url, price, product } = productObj;

              return (
                <>
                  <tr className={clsx({ odd, selected })}>
                    <td>
                      <Checkbox value={selected} size="sm" onChange={call(toggle, !selected)} />
                    </td>
                    <td>
                    <RetailerProductPopup
                        action={putRetailerProduct}
                        data={{
                          ...productObj,
                          retailer: (retailer && retailer._id) || null,
                        }}
                        title="Edit retailer"
                        onSave={this.query}>
                        {product.name}
                        <Icon value="fal-edit" />
                      </RetailerProductPopup>
                    </td>
                    <td>{price || '-'}</td>
                    <td><a href={product_url} target="_blank">Product Url</a></td>
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
        <Paginate {...products} route={route} />
      </div>
    );
  }

  async componentDidMount() {
    this.query();
    const { params: { retailer_id: id } = {} } = this.props.match || {};
    if (id) {
      this.props.dispatch(getRetailer(id));
    }
  }

  componentDidUpdate(props) {
    this.query(props);
    autoRedirect(this, 'products');
  }

  /**
   * Delete retailer
   */
  delete(_id) {
    const { params: { retailer_id: id } = {} } = this.props.match;
    when(deleteRetailer(_id)).
    then()
    .then(response => {
      this.props.dispatch(getProductsForRetailer(id));
    });
  }



  /**
   * Perform query
   */
  query(props) {
    const { query = {} } = this.props.route;
    const { params: { retailer_id: id } = {} } = this.props.match;
    if (isUndefined(props) || !isEqual(query, props.route.query)) {
      this.props.dispatch(getProductsForRetailer(id));
    }
  }
}

export default connect(({ api: { retailerProduct, retailer }, router }) => {
  return {
    retailerDetails: retailer.retailer,
    products: retailerProduct.products_of_retailer,
    route: routeQuery(router)
  };
})(Retailers);
