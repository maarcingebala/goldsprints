import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import Race from './components/race';
import FreeRide from './components/freeRide';
import {initializeRace, initializeFreeRide} from './actions';
import * as T from './actions/types';
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
  let mode = raceContainer.dataset.mode;
  let prevRaceUrl = raceContainer.dataset.prevRaceUrl;
  let nextRaceUrl = raceContainer.dataset.nextRaceUrl;

  if (mode === T.MODE_RACE) {
    store.dispatch(initializeRace(
      playerA, playerB, distance, saveRaceUrl, nextRaceUrl, prevRaceUrl));
    ReactDOM.render(
      <Provider store={store}>
        <Race />
      </Provider>,
      raceContainer
    );
  } else {
    store.dispatch(initializeFreeRide(playerA, playerB, distance));
    ReactDOM.render(
      <Provider store={store}>
        <FreeRide />
      </Provider>,
      raceContainer
    );
  }
}
