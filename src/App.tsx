import React from 'react';
import { WrappedComponentProps } from 'react-with-firebase-auth';

import FirebaseContext from './components/FirebaseContext';
import AuthPage from './pages/Auth';
import MainPage from './pages/Main';

function App({ user, signInWithEmailAndPassword }: WrappedComponentProps) {
  if (typeof user === 'undefined') {
    return null;
  }

  if (user === null) {
    return <AuthPage onSubmit={signInWithEmailAndPassword} />;
  }

  return (
    <FirebaseContext.Consumer>
      {(firebase) => <MainPage />}
    </FirebaseContext.Consumer>
  );
}

export default App;
