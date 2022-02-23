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
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from '../../../api/product/actions';
import CategoryPopup from './CategoryPopup';
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
  name: 'Name',
};

/**
 * Sort keys
 */
export const sortKeys = keys(sortFields);

/**
 * Admin Categories
 */
class Categories extends Component {

  constructor(...args) {
    super(...args);
    bind(this, [
      'delete',
      'query'
    ]);
  }

  render() {
    const { categories, route } = this.props;
    return (
      <div className="Categories">
        <Filters
          create={{
            action: createCategory,
            caption: '+ Add category',
            onSave: this.query,
            popup: CategoryPopup,
            title: 'Add category'
          }}
          route={route}
        />
        <Table {...categories} route={route}>
          {() => ({
            head: ({ selected, sort, toggle }) => (
              <>
                <tr>
                  <th>
                    <Checkbox icon="fa-minus" value={selected} size="sm" onChange={call(toggle, !selected)}>
                      {selected ? 'Deselect' : 'Select'} All ({this.props.categories.count})
                    </Checkbox>
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <th></th>
                  {sortKeys.map((key) => (
                    <th key={key}>{sort(key, sortFields[key])}</th>
                  ))}
                  <th>Rebate</th>
                  <th></th>
                </tr>
              </>
            ),
            row: (category, { odd, selected, toggle }) => {
              const { _id, name } = category;
              return (
                <>
                  <tr className={clsx({ odd, selected })}>
                    <td>
                      <Checkbox value={selected} size="sm" onChange={call(toggle, !selected)} />
                    </td>
                    <td className="no-padding">
                      <CategoryPopup
                        action={updateCategory}
                        data={category}
                        title="Edit category"
                        onSave={this.query}>
                        {name}
                        <Icon value="fal-edit" />
                      </CategoryPopup>
                    </td>
                    <td>{category.rebate ? category.rebate.amount + "$" : "-" }</td>
                    <td className="delete">
                      <Confirm
                        message="Are you sure you want to delete this category?"
                        ok={{ title: 'Delete Category' }}
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
        <Paginate {...categories} route={route} />
      </div>
    );
  }

  componentDidMount() {
    this.query();
  }

  componentDidUpdate(props) {
    this.query(props);
    autoRedirect(this, 'categories');
  }

  /**
   * Delete category
   */
  delete(_id) {
    return when(deleteCategory(_id)).then(() => () => {
      this.query();
    });
  }

  /**
   * Perform query
   */
  query(props) {
    const { query = {} } = this.props.route;
    if (isUndefined(props) || !isEqual(query, props.route.query)) {
      this.props.dispatch(getCategories(query));
    }
  }
}

export default connect(({ api: { product }, router }) => {
  return {
    categories: product.categories,
    route: routeQuery(router)
  };
})(Categories);
