import React from 'react';
import PropTypes from 'prop-types';

import FirebaseContext from './components/FirebaseContext';
import AuthPage from './pages/Auth';
import MainPage from './pages/Main';

function App({ user, signInWithEmailAndPassword }) {
  if (typeof user === 'undefined') {
    return null;
  }

  if (user === null) {
    return <AuthPage onSubmit={signInWithEmailAndPassword} />;
  }

  return (
    <FirebaseContext.Consumer>
      {firebase => <MainPage firebase={firebase} />}
    </FirebaseContext.Consumer>
  );
}

App.propTypes = {
  user: PropTypes.object,
  signInWithEmailAndPassword: PropTypes.func,
};

export default App;
