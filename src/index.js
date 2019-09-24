import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase/app';
import withFirebaseAuth from 'react-with-firebase-auth';
import 'firebase/auth';
import 'firebase/firestore';

import App from './App';
import FirebaseContext from './components/FirebaseContext';
import firebaseConfig from './config/firebase';
import * as serviceWorker from './serviceWorker';

import './index.css';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const AppWithAuth = withFirebaseAuth({ firebaseAppAuth })(App);

ReactDOM.render(
  <FirebaseContext.Provider value={firebaseApp}>
    <AppWithAuth />
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
