import React from "react";
import * as firebase from "firebase/app";
import withFirebaseAuth from "react-with-firebase-auth";
import firebaseConfig from "./config/firebase.json";
import "firebase/auth";

import Auth from "./components/Auth";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

function App({ user, signInWithEmailAndPassword, signOut }) {
  if (typeof user === "undefined") {
    return null;
  }

  if (user === null) {
    return <Auth onSubmit={signInWithEmailAndPassword} />;
  }

  return <div>Logged</div>;
}

export default withFirebaseAuth({ firebaseAppAuth })(App);
