/* eslint-disable no-underscore-dangle */

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import type firebase from 'firebase/app';
import rootReducer from './slices';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const configureStore = (firebase: firebase.app.App) => {
  const enhancer = composeEnhancers(
    applyMiddleware(thunk.withExtraArgument({ firebase })),
  );

  return createStore(rootReducer, enhancer);
};

export default configureStore;
