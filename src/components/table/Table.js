import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import keys from 'lodash/keys';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { join, watch } from '../../store';
import { freeze, getScroll, onScroll, sort } from '../../utils';
import './Table.scss';
import Icon from '../utils/Icon';
import Loader from '../utils/loader/Loader';
import Selector from '../selector/Selector';

/**
 * Table component
 */
export default class Table extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      keys: [],
      selected: []
    };
  }

  render() {
    const { busy, children, data } = this.props,
          { selected } = this.state,
          { head, row } = children();
    return (
      <div className={clsx('Table', { busy })}>
        {(!busy ? '' :
          <Loader />
        )}
        <table>
          <thead>
            {head({
              selected: (selected.length && (selected.length === this.state.keys.length)),
              sort: (field, title) => {
                if (isString(field)) {
                  return this.getSortLink(field, title);
                } else if (isObject(field)) {
                  const { query } = this.props.route;
                  return (
                    <Selector
                      className="sort-selector"
                      data={field}
                      item={(caption, key) => this.getSortLink(key, caption)}
                      title={(caption) => caption}>
                      {({ toggle }) => (
                        <span onClick={freeze(toggle)}>
                          <span>{field[query.sort] || title || 'Sort by'}</span>
                          <Icon value={'fa-chevron-' + ((query.order === 'desc') ? 'up' : 'down')} />
                        </span>
                      )}
                    </Selector>
                  );
                }
              },
              state: this.state,
              toggle: (checked) => {
                this.setState((state) => ({
                  ...state,
                  selected: checked ? state.keys.slice(0) : []
                }));
              }
            })}
          </thead>
          <tbody>
            {this.state.keys.map((id, i) => {
              const index = selected.indexOf(id),
                    even = (i % 2);
              if (!data[id]) {
                return (
                  <Fragment key={id}></Fragment>
                );
              }
              return (
                <Fragment key={id}>
                  {row(data[id], {
                    even,
                    index: i,
                    odd: !even,
                    selected: index >= 0,
                    toggle: (checked) => {
                      if (checked && index < 0) {
                        this.setState({
                          selected: [
                            ...selected,
                            id
                          ]
                        });
                      } else if (!checked && index >= 0) {
                        this.setState({
                          selected: [
                            ...selected.slice(0, index),
                            ...selected.slice(index + 1)
                          ]
                        });
                      }
                    }
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    )
  }

  componentDidMount() {
    if (this.props.infinite) {
      const { action } = this.props.infinite;
      this.action = watch([join(action, 'COMPLETE')], () => {
        this.checkEnd();
      });
      this.unscroll = onScroll(() => {
        if (!this.props.busy) {
          this.checkEnd();
        }
      });
    }
  }

  componentDidUpdate(props) {
    if (this.props.data !== props.data) {
      this.setState({
        keys: keys(this.props.data)
      });
    }
  }

  componentWillUnmount() {
    if (this.action) {
      this.action.cancel();
      this.unscroll();
    }
  }

  /**
   * Check if reached end
   */
  checkEnd(allowance = 50) {
    const { height, position } = getScroll();
    if (position > (height - allowance)) {
      if (this.props.infinite && isFunction(this.props.infinite.onReachEnd)) {
        this.props.infinite.onReachEnd();
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get sort link
   */
  getSortLink(field, title) {
    const { active, icon, url } = sort(this.props.route, field);
    return (
      <Link to={url} className={clsx('sort', { active })}>
        <span>{title}</span>
        <Icon value={'fas-' + icon} />
      </Link>
    );
  }
}
