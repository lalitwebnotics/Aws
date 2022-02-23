import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import { wrap } from './store';
import './style/index.scss';
import App from './components/app/App';

export const root = document.getElementById('root');

ReactDOM.render(wrap(<App />), root);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
