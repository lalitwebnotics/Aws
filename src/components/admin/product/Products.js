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
import { getProducts } from '../../../api/product/actions';
import { manufacturer as ManufacturerDataService } from '../../../api/index'
import Checkbox from '../../inputs/checkbox/Checkbox';
import Confirm from '../../popups/Confirm';
import Filters from '../Filters';
import Icon from '../../utils/Icon';
import Paginate from '../../paginate/Paginate';
import Table from '../../table/Table';
import ImagePopup from './ImagePopup';
import ProductPopup from './ProductPopup';

import './Product.scss'


import {
  createProduct,
  updateCategory,
  updateProduct,
  deleteProduct
} from '../../../api/product/actions';

/**
 * Sort fields
 */
export const sortFields = {
  name: 'Name',
  part: 'Part',
  price: 'Price'
};

/**
 * Sort keys
 */
export const sortKeys = keys(sortFields);

/**
 * Admin Products
 */
class Products extends Component {

  constructor(...args) {
    super(...args);

    this.state = {
      manufacturerAutocomplete: []
    };

    bind(this, [
      'delete',
      'query'
    ]);
  }

  render() {
    const { products, route } = this.props;

    return (
      <div className="Products">
        <Filters
          create={{
            action: createProduct,
            caption: '+ Add product',
            onSave: this.query,
            popup: ProductPopup,
            title: 'Add product',
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
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <th></th>
                  {sortKeys.map((key) => (
                    <th key={key}>{sort(key, sortFields[key])}</th>
                  ))}
                  <th>Manufacturer</th>
                  <th>Certificate</th>
                  <th></th>
                  <th></th>
                </tr>
              </>
            ),
            row: (product, { odd, selected, toggle }) => {
              const { _id, certificate, certificates, manufacturer, name, part, price, media } = product;

              if (product.rebate != null || product.rebate != undefined) {
                product.rebate_name = product.rebate.manufacturer.name + " - $" + product.rebate.amount;
              }

              let notNullCertificates = certificates ? certificates.filter(x => x) : [];

              if (certificates && notNullCertificates.length > 0) {
                product.certificates = certificates.map(x => {
                  x.value = x._id;
                  x.label = x.name;
                  return x;
                });
              }

              if (product.retailers && product.retailers.length > 0) {
                product.retailers = product.retailers.map(x => {
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
                      <ProductPopup
                        action={updateProduct}
                        data={product}
                        title="Edit product"
                        onSave={this.postUpdate}>
                        {name}
                        <Icon value="fal-edit" />
                      </ProductPopup>
                    </td>
                    <td>{part || '-'}</td>
                    <td>{price || '-'}</td>
                    <td>{manufacturer ? manufacturer.name : '-'}</td>
                    <td>{certificates && certificates.length > 0 ? certificates.map(cert => cert.name).join(', ') : '-'}</td>
                    <td className="image-product">
                      <ImagePopup
                        productId={_id}
                        media={media}
                        // action={updateCategory}
                        title="Upload Images"
                        onSave={this.query}>
                        <Icon value="fa-file" />
                      </ImagePopup>
                    </td>
                    <td className="delete">
                      <Confirm
                        message="Are you sure you want to delete this product?"
                        ok={{ title: 'Delete Product' }}
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
  }

  componentDidUpdate(props) {
    this.query(props);
    autoRedirect(this, 'products');
  }

  /**
   * Delete product
   */
  delete(_id) {
    when(deleteProduct(_id)).
      then()
      .then(response => {
        this.props.dispatch(getProducts());
      });
  }



  /**
   * Perform query
   */
  query(props) {
    const { query = {} } = this.props.route;
    if (isUndefined(props) || !isEqual(query, props.route.query)) {
      this.props.dispatch(getProducts(query));
    }
  }

  postUpdate() {
    this.location.reload();
  }
}

export default connect(({ api: { product }, router }) => {
  return {
    products: product.products,
    route: routeQuery(router)
  };
})(Products);
