import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import type firebase from 'firebase/app';

import AuthPage from './pages/Auth';
import MainPage from './pages/Main';

interface Props {
  firebase: firebase.app.App;
}

function App({ firebase }: Props) {
  const firebaseAuth = firebase.auth();
  const [user, loading] = useAuthState(firebaseAuth);

  if (loading) {
    return null;
  }

  return user ? <MainPage /> : <AuthPage firebaseAuth={firebaseAuth} />;
}

export default App;
