import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import {
  rootReducer,
  rootEpic,
} from './root';
import './index.css';
import MainApp from './main/components/App';
import registerServiceWorker from './registerServiceWorker';

/**
 * Inject dependencies across all middleware.
 */
const epicMiddleware = createEpicMiddleware({
  dependencies: {
    getJSON: ajax.getJSON,
  },
});

/**
 * Configures the store to use our reducer and middleware.
 */
const configureStore = () => {
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(epicMiddleware)),
  );
  epicMiddleware.run(rootEpic);

  return store;
};

render(
  <Provider store={configureStore()}>
    <MainApp />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
