import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import withFirebaseAuth from 'react-with-firebase-auth';
import { Provider } from 'react-redux';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'firebase/auth';
import 'firebase/firestore';

import configureStore from './redux';
import App from './App';
import FirebaseContext from './components/FirebaseContext';
import createFirebaseConfig from './config/firebase';
import * as serviceWorker from './serviceWorker';

import './index.css';

const firebaseApp = firebase.initializeApp(
  createFirebaseConfig(process.env.NODE_ENV),
);
const firebaseAppAuth = firebaseApp.auth();
const store = configureStore(firebaseApp);

const AppWithAuth = withFirebaseAuth({ firebaseAppAuth })(App);

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#73FFCC',
    },
    background: {
      main: '#15232E',
      dark: '#111c25',
      default: '#15232E',
      paper: '#1A2D3C',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.8)',
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <FirebaseContext.Provider value={firebaseApp}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppWithAuth />
      </ThemeProvider>
    </FirebaseContext.Provider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
