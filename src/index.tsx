import React from 'react';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'firebase/auth';
import 'firebase/firestore';

import App from './App';
import store from './redux/store';
import reportWebVitals from './reportWebVitals';

import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import './index.css';

Sentry.init({
  dsn: 'https://7718d836108d482d812a93fd548ac9d3@o50300.ingest.sentry.io/5750589',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_REVISION || 'unknown',
  enabled: process.env.NODE_ENV === 'production',
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
