import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import game from '../reducers';


export default function configureStore(initialState) {
  const store = createStore(game, initialState, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
