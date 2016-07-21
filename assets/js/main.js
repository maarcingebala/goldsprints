import thunkMiddleware from 'redux-thunk';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import App from './components/app';
import Canvas from './components/canvas';
import race from './reducers';
import {initialize} from './actions';

import '../scss/pricedown.scss';
import '../scss/main.scss';

const store = createStore(
  race,
  applyMiddleware(
    thunkMiddleware,
  )
)

let raceContainer = document.getElementById('race-container');
if (raceContainer) {
  let playerA = raceContainer.dataset.playerA;
  let playerB = raceContainer.dataset.playerB;
  let distance = parseFloat(raceContainer.dataset.distance);
  let saveRaceUrl = raceContainer.dataset.saveRaceUrl;

  store.dispatch(initialize(playerA, playerB, distance, saveRaceUrl));

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    raceContainer
  );
}
