import React from "react";

import FirebaseContext from "./components/FirebaseContext";
import AuthPage from "./pages/Auth";
import MainPage from "./pages/Main";

function App({ user, signInWithEmailAndPassword, signOut, ...rest }) {
  if (typeof user === "undefined") {
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

export default App;
