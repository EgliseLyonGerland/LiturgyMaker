import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase/app';
import withFirebaseAuth from 'react-with-firebase-auth';
import { Provider } from 'react-redux';
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

ReactDOM.render(
  <Provider store={store}>
    <FirebaseContext.Provider value={firebaseApp}>
      <AppWithAuth />
    </FirebaseContext.Provider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
