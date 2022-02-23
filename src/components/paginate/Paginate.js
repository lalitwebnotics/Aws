import range from 'lodash/range';
import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { toQuery } from '../../utils';
import './Paginate.scss';
import Icon from '../utils/Icon';

/**
 * Paginate component
 */
export default function Paginate({ busy, count, pages = 7, route }) {
  const { query } = route,
        start = parseInt(query.start || '0'),
        limit = parseInt(query.limit || '20'),
        first = 1,
        last = Math.ceil(count / limit),
        current = Math.floor(start / limit) + 1,
        right = current +  Math.floor(pages / 2),
        left = right - (pages - 1),
        below = (left < first) ? (first - left) : 0,
        high = right + below,
        above = (high > last) ? (high - last) : 0,
        low = left - above,
        isFirst = (current === first),
        isLast = (current === last);
  return (
    <div className="Paginate">
      <ul>
        <li className={clsx({ disabled: isFirst || busy })}>
          {((isFirst || busy) ?
            <span>
              <Icon value="fa-chevron-double-left" />
            </span> :
            <Link to={route.path + toQuery({
              ...query,
              start: 0,
              limit
            })}>
              <Icon value="fa-chevron-double-left" />
            </Link>
          )}
        </li>
        <li className={clsx({ disabled: (isFirst || busy) })}>
          {((isFirst || busy) ?
            <span>
              <Icon value="fa-chevron-left" />
            </span> :
            <Link to={route.path + toQuery({
              ...query,
              start: start - limit,
              limit
            })}>
              <Icon value="fa-chevron-left" />
            </Link>
          )}
        </li>
        {range(Math.max(low, first), Math.min(high, last) + 1).map((page) => (
          <li className={clsx({ active: (current === page), disabled: busy })} key={page}>
            {(busy ?
              <span>{page}</span> :
              <Link to={route.path + toQuery({
                ...query,
                start: (page - 1) * limit,
                limit
              })}>{page}</Link>
            )}
          </li>
        ))}
        <li className={clsx({ disabled: (isLast || busy) })}>
          {((isLast || busy) ?
            <span>
              <Icon value="fa-chevron-right" />
            </span> :
            <Link to={route.path + toQuery({
              ...query,
              start: start + limit,
              limit
            })}>
              <Icon value="fa-chevron-right" />
            </Link>
          )}
        </li>
        <li className={clsx({ disabled: (isLast || busy) })}>
          {((isLast || busy) ?
            <span>
              <Icon value="fa-chevron-double-right" />
            </span> :
            <Link to={route.path + toQuery({
              ...query,
              start: (last - 1) * limit,
              limit
            })}>
              <Icon value="fa-chevron-double-right" />
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}
