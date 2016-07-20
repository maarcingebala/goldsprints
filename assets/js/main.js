import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './components/app';
import Canvas from './components/canvas';
import race from './reducers';
import {initialize} from './actions';

import '../scss/pricedown.scss';
import '../scss/main.scss';


let store = createStore(race, window.devToolsExtension && window.devToolsExtension());

let raceContainer = document.getElementById('race-container');
if (raceContainer) {
  let playerOne = raceContainer.dataset.playerOne;
  let playerTwo = raceContainer.dataset.playerTwo;
  let distance = parseFloat(raceContainer.dataset.distance);

  store.dispatch(initialize(playerOne, playerTwo, distance));

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    raceContainer
  );
}
