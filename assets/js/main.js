import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './components/app';
import {initialize} from './actions';
import configureStore from './store/configureStore';

import '../scss/pricedown.scss';
import '../scss/main.scss';

const store = configureStore();

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
