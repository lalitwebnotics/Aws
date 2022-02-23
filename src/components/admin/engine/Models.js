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
import { TYPES } from '../../../api/engine/Engine';
import {
  createEngineModel,
  deleteEngineModel,
  getEngineModels,
  updateEngineModel
} from '../../../api/engine/actions';
import Checkbox from '../../inputs/checkbox/Checkbox';
import Confirm from '../../popups/Confirm';
import EngineModelPopup from './ModelPopup';
import Filters from '../Filters';
import Icon from '../../utils/Icon';
import Paginate from '../../paginate/Paginate';
import Table from '../../table/Table';

/**
 * Sort fields
 */
export const sortFields = {
  name: 'Name',
  type: 'Type',
  cylinders: 'Cylinders'
};

/**
 * Sort keys
 */
export const sortKeys = keys(sortFields);

/**
 * Admin Engine Models
 */
class EngineModels extends Component {

  constructor(...args) {
    super(...args);
    bind(this, [
      'delete',
      'query'
    ]);
  }

  render() {
    const { models, route } = this.props;
    return (
      <div className="EngineModels">
        <Filters
          create={{
            action: createEngineModel,
            caption: '+ Add engine model',
            onSave: this.query,
            popup: EngineModelPopup,
            title: 'Add engine model'
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
                </tr>
                <tr>
                  <th></th>
                  {sortKeys.map((key) => (
                    <th key={key}>{sort(key, sortFields[key])}</th>
                  ))}
                  <th>Engine Make</th>
                  <th>Certificate</th>
                  <th></th>
                </tr>
              </>
            ),
            row: (model, { odd, selected, toggle }) => {
              const { _id, certificate, cylinders, engine_make, name, type } = model;
              return (
                <>
                  <tr className={clsx({ odd, selected })}>
                    <td>
                      <Checkbox value={selected} size="sm" onChange={call(toggle, !selected)} />
                    </td>
                    <td className="no-padding">
                      <EngineModelPopup
                        action={updateEngineModel}
                        data={model}
                        title="Edit engine model"
                        onSave={this.query}>
                        {name}
                        <Icon value="fal-edit" />
                      </EngineModelPopup>
                    </td>
                    <td>{TYPES[type] || '-'}</td>
                    <td>{cylinders || '-'}</td>
                    <td>{engine_make ? engine_make.name : '-'}</td>
                    <td>{certificate || '-'}</td>
                    <td className="delete">
                      <Confirm
                        message="Are you sure you want to delete this engine model?"
                        ok={{ title: 'Delete Engine Model' }}
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

  componentDidMount() {
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
    return when(deleteEngineModel(_id)).then(() => () => {
      this.query();
    });
  }

  /**
   * Perform query
   */
  query(props) {
    const { query = {} } = this.props.route;
    if (isUndefined(props) || !isEqual(query, props.route.query)) {
      this.props.dispatch(getEngineModels(query));
    }
  }
}

export default connect(({ api: { engine }, router }) => {
  return {
    models: engine.models,
    route: routeQuery(router)
  };
})(EngineModels);
