import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import FirebaseContext from './components/FirebaseContext';
import AuthPage from './pages/Auth';
import FormPage from './pages/Form';
import SlidesPage from './pages/Slides';

function App({ user, signInWithEmailAndPassword }) {
  if (typeof user === 'undefined') {
    return null;
  }

  if (user === null) {
    return <AuthPage onSubmit={signInWithEmailAndPassword} />;
  }

  return (
    <FirebaseContext.Consumer>
      {(firebase) => (
        <Router>
          <Switch>
            <Route path="/" exact>
              <FormPage firebase={firebase} />
            </Route>
            <Route path="/slides" exact>
              <SlidesPage />
            </Route>
          </Switch>
        </Router>
      )}
    </FirebaseContext.Consumer>
  );
}

App.propTypes = {
  user: PropTypes.object,
  signInWithEmailAndPassword: PropTypes.func,
};

export default App;
