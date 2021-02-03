/* eslint-disable no-underscore-dangle */

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './slices';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const configureStore = (firebase) => {
  const enhancer = composeEnhancers(
    applyMiddleware(thunk.withExtraArgument({ firebase })),
  );

  return createStore(rootReducer, enhancer);
};

export default configureStore;
