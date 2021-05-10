import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import { Provider } from 'react-redux';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import 'firebase/auth';
import 'firebase/firestore';

import configureStore from './redux';
import App from './App';
import firebaseConfig from './config/firebase';
import reportWebVitals from './reportWebVitals';
import './index.css';

Sentry.init({
  dsn:
    'https://7718d836108d482d812a93fd548ac9d3@o50300.ingest.sentry.io/5750589',
  integrations: [new Integrations.BrowserTracing()],
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

const firebaseApp = firebase.initializeApp(firebaseConfig);
const store = configureStore(firebaseApp);

if (process.env.NODE_ENV === 'development') {
  firebase.auth().useEmulator('http://localhost:9099');
  firebase.firestore().useEmulator('localhost', 8080);
}

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary: PaletteOptions['primary'];
  }
}

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#80A4ED',
    },
    tertiary: {
      light: '#1A2D3C',
      main: '#15232E',
      dark: '#121e27',
    },
    background: {
      default: '#15232E', // same as tertiary.main
      paper: '#1A2D3C', // same as tertiary.light
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.6)',
      secondary: 'rgba(255, 255, 255, 0.4)',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App firebase={firebaseApp} />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
