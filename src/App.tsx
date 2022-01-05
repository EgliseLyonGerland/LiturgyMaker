import React from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from './firebase';
import AuthPage from './pages/Auth';
import MainPage from './pages/Main';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return null;
  }

  return user ? <MainPage /> : <AuthPage firebaseAuth={auth} />;
}

export default App;
