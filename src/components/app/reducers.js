import { handleActions } from 'redux-actions';

/**
 * App state
 */
export const appState = {
  device: null,
  menu: {
    main: false
  },
  ready: false,
  sidebar: {
    filters: false
  },
  search: []
};

/**
 * App reducer
 */
export default handleActions({
  DEVICE_CHANGE: (state, { payload }) => ({
    ...state,
    device: payload
  }),
  INITIALIZE_COMPLETE: (state) => ({
    ...state,
    ready: true
  }),
  MENU_MAIN_TOGGLE: (state) => ({
    ...state,
    menu: {
      ...state.menu,
      main: !state.menu.main
    }
  }),
  SIDEBAR_FILTERS_TOGGLE: (state) => ({
    ...state,
    sidebar: {
      ...state.sidebar,
      filters: !state.sidebar.filters
    }
  }),
  SET_SIDEBAR_SEARCH: (state, {payload}) => ({
    ...state,
    search: payload
  }) 
},
appState);
