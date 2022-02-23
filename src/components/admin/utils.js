import isEmpty from 'lodash/isEmpty';

import { redirect } from '../../routes';
import { toQuery } from '../../utils';

/**
 * Admin utils
 */
export function autoRedirect(component, name) {
  const collection = component.props[name];
  if (!collection.busy && collection.count > 0 && isEmpty(collection.data)) {
    const limit = parseInt(collection.query.limit || '20'),
          start = Math.floor(collection.count / limit) * limit;
    redirect(component.props.route.path + toQuery({
      ...component.props.route.query,
      start
    }));
  }
}
