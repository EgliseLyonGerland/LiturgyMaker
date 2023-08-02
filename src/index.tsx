import { StrictMode } from 'react';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'firebase/auth';
import 'firebase/firestore';

import App from './App';
import store from './redux/store';

import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import './index.css';

Sentry.init({
  dsn: 'https://7718d836108d482d812a93fd548ac9d3@o50300.ingest.sentry.io/5750589',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.NODE_ENV,
  release: import.meta.env.REACT_APP_REVISION || 'unknown',
  debug: import.meta.env.NODE_ENV !== 'production',
  enabled: import.meta.env.NODE_ENV === 'production',
  beforeSend(event) {
    if (event.exception) {
      Sentry.showReportDialog({
        eventId: event.event_id,
        user: { name: event.user?.username },
      });
    }
    return event;
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
