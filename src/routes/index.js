import isUndefined from 'lodash/isUndefined';
import omit from 'lodash/omit';
import trimEnd from 'lodash/trimEnd';
import trimStart from 'lodash/trimStart';
import React, { lazy } from 'react';
import { createBrowserHistory } from 'history';
import { Route, withRouter } from 'react-router-dom';

import { fromQuery } from '../utils';
import { watch } from '../store';
import Auth from './guards/Auth';

/**
 * Browser history
 */
export const history = createBrowserHistory();

/**
 * Route guards
 */
export const guards = {
  auth: Auth
};

/**
 * Admin guard
 */
export const adminGuard = {
  name: 'auth',
  redirect: '/',
  target: 'admin'
};

/**
 * Logged in
 */
export const loggedInGuard = {
  name: 'auth',
  redirect: '/',
  target: 'any'
};

/**
 * Not logged in
 */
export const notLoggedInGuard = {
  name: 'auth',
  redirect: '/inventory',
  target: 'none'
};

/**
 * All routes
 */
const routeList = [
  {
    path: '/',
    component: lazy(() => import('../components/login/Login')),
    guards: [notLoggedInGuard],
    exact: true,
    title: 'Login'
  },
  {
    path: '/forgot-password',
    component: lazy(() => import('../components/forgot-password/ForgotPassword')),
    guards: [notLoggedInGuard],
    exact: true,
    title: 'Forgot Password'
  },
  {
    path: '/password-reset',
    component: lazy(() => import('../components/password-reset/PasswordReset')),
    guards: [notLoggedInGuard],
    exact: true,
    title: 'Password Reset'
  },
  {
    path: '/logout',
    component: lazy(() => import('../components/logout/Logout')),
    exact: true,
    title: 'Logout'
  },
  {
    path: '/account',
    component: lazy(() => import('../components/account/Account')),
    title: 'My Account'
  },
  {
    path: '/inventory',
    component: lazy(() => import('../components/admin/Admin')),
    guards: [adminGuard],
    exact: false,
    routes: [
      {
        path: '',
        component: lazy(() => import('../components/admin/Dashboard')),
        title: 'Dashboard'
      },
      {
        path: '/aircraft',
        component: lazy(() => import('../components/admin/aircraft/Aircraft')),
        exact: false,
        title: 'Aircraft',
        routes: [
          {
            path: '',
            component: lazy(() => import('../components/admin/aircraft/Models')),
            title: 'Aircraft Models'
          },
          {
            path: '/makes',
            component: lazy(() => import('../components/admin/aircraft/Makes')),
            title: 'Aircraft Makes'
          },
          {
            path: '/make-model-upload',
            component: lazy(() => import('../components/admin/aircraft/MakeModelUpload')),
            title: 'Upload CSV'
          }
        ]
      },
      {
        path: '/engine',
        component: lazy(() => import('../components/admin/engine/Engine')),
        exact: false,
        title: 'Engine',
        routes: [
          {
            path: '',
            component: lazy(() => import('../components/admin/engine/Models')),
            title: 'Engine Models'
          },
          {
            path: '/makes',
            component: lazy(() => import('../components/admin/engine/Makes')),
            title: 'Engine Makes'
          }
        ]
      },
      {
        path: '/product',
        component: lazy(() => import('../components/admin/product/Product')),
        exact: false,
        title: 'Product',
        routes: [
          {
            path: '',
            component: lazy(() => import('../components/admin/product/Products')),
            title: 'Products'
          },
          {
            path: '/certificates',
            component: lazy(() => import('../components/admin/certificate/Certificates')),
            title: 'Certificates'
          },
          {
            path: '/categories',
            component: lazy(() => import('../components/admin/product/Categories')),
            title: 'Categories'
          },
          {
            path: '/manufacturer',
            component: lazy(() => import('../components/admin/manufacturer/Manufacturer')),
            title: 'Manufacturer'
          },
          {
            path: '/rebates',
            component: lazy(() => import('../components/admin/rebates/Rebates')),
            title: 'Rebates'
          },
          {
            path: '/retailers',
            component: lazy(() => import('../components/admin/retailer/Retailers')),
            title: 'Retailers'
          },
          {
            path: '/retailers/:retailer_id',
            component: lazy(() => import('../components/admin/retailer/RetailerProducts')),
            title: 'Retailer Products',
            id: 'retailer-products'
          }
        ]
      },
      // {
      //   path: '/rebates',
      //   component: lazy(() => import('../components/admin/rebates/Rebate')),
      //   exact: false,
      //   title: 'Rebates',
      //   routes: [
      //     {
      //       path: '',
      //       component: lazy(() => import('../components/admin/rebates/Rebates')),
      //       title: 'Rebates'
      //     },
      //   ]
      // },
      // {
      //   path: '/manufacturer',
      //   component: lazy(() => import('../components/admin/manufacturer/Manufacturer')),
      //   title: 'Manufacturer'
      // }
    ]
  }
];

/**
 * Apply guards
 */
export function applyGuards(item, index = 0) {
  const guard = (item.guards || [])[index];
  if (isUndefined(guard)) {
    return <item.component {...item.props} routes={item.routes} />
  } else {
    const Guard = guards[guard.name]
    return (
      <Guard {...omit(guard, ['name'])}>
        {applyGuards(item, index + 1)}
      </Guard>
    );
  }
}

/**
 * On route change
 */
export function onRouteChange(callback) {
  const watcher = watch(['@@router/LOCATION_CHANGE'], callback);
  return () => {
    watcher.cancel();
  };
}

/**
 * Redirect
 */
export function redirect(path, replace = false) {
  return history[replace ? 'replace' : 'push'](path);
}

/**
 * Get route
 */
export function route(item) {
  if (!item.component) {
    item = {
      component: item,
    };
  }
  const routes = (item.routes || []).map((subroute) => {
    const subpath = trimStart(subroute.path, '/'),
      path = trimEnd(item.path, '/') + (subpath ? ('/' + subpath) : '');
    return {
      ...subroute,
      path
    };
  });
  return (
    <Route
      key={item.path}
      exact={item.exact !== false}
      path={item.path}
      render={(props) => applyGuards({
        ...item,
        props,
        routes
      })}
    />
  );
}

/**
 * Route query
 */
export function routeQuery({ location: { pathname, search } }) {
  return {
    path: pathname,
    query: fromQuery(search)
  };
}

/**
 * Get routes
 */
export function routes(list) {
  return list.map(route);
}

/**
 * Use router
 */
export function useRouter(Component) {
  return withRouter((props) => {
    return (
      <Component {...props} />
    );
  });
}

export default routeList;
