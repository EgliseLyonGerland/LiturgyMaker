import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
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
import './index.css';

Sentry.init({
  dsn: 'https://7718d836108d482d812a93fd548ac9d3@o50300.ingest.sentry.io/5750589',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === 'production',
});

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
          <App />
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
