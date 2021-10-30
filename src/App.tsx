import React from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from './firebase';
import AuthPage from './pages/Auth';
import MainPage from './pages/Main';

function App() {
  const firebaseAuth = firebase.auth();
  const [user, loading] = useAuthState(firebaseAuth);

  if (loading) {
    return null;
  }

  return user ? <MainPage /> : <AuthPage firebaseAuth={firebaseAuth} />;
}

export default App;
