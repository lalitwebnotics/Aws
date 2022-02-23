/**
 * Configuration
 */
const serverPort = process.env.REACT_APP_SERVER_PORT;
export default {
  api: {
    debounce: {
      authorization: 1000
    },
    cdn_url: 'https://d2kijztdgb1j07.cloudfront.net/',
    root: '//' + (serverPort ? window.location.hostname : window.location.host) + `${serverPort ? `:${serverPort}` : ''}/api/v1/`,
    token: 'aircraft-token'
  },
  breakpoints: {
    xs: 0,
    sm: 320,
    md: 768,
    lg: 992,
    xl: 1200
  },
  redux: {
    logger: false
  }
};
