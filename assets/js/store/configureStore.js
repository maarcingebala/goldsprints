import thunk from 'redux-thunk';
import game from '../reducers';
import {createStore, applyMiddleware, compose} from 'redux';


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
