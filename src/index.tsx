import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import withFirebaseAuth, {
  WrappedComponentProps,
} from 'react-with-firebase-auth';
import { Provider } from 'react-redux';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import 'firebase/auth';
import 'firebase/firestore';

import configureStore from './redux';
import App from './App';
import FirebaseContext from './components/FirebaseContext';
import createFirebaseConfig from './config/firebase';
import reportWebVitals from './reportWebVitals';
import './index.css';

const firebaseApp: any = firebase.initializeApp(
  createFirebaseConfig(process.env.NODE_ENV),
);
const firebaseAppAuth = firebaseApp.auth();
const store = configureStore(firebaseApp);

const AppWithAuth = withFirebaseAuth({ firebaseAppAuth })(
  App as ComponentType<object & WrappedComponentProps>,
);

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
        <FirebaseContext.Provider value={firebaseApp}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppWithAuth />
          </ThemeProvider>
        </FirebaseContext.Provider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
