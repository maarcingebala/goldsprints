import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as T from './actions/types';
import Race from './components/race';
import FreeRide from './components/freeRide';
import configureStore from './store/configureStore';
import { initializeRace, initializeFreeRide } from './actions';

import '../scss/pricedown.scss';
import '../scss/main.scss';

const store = configureStore();

const raceContainer = document.getElementById('race-container');
if (raceContainer) {
  const {
    playerA,
    playerB,
    saveRaceUrl,
    mode,
    prevRaceUrl,
    nextRaceUrl
  } = raceContainer.dataset;
  const distance = parseFloat(raceContainer.dataset.distance);

  if (mode === T.MODE_RACE) {
    store.dispatch(initializeRace(playerA, playerB, distance, saveRaceUrl, nextRaceUrl, prevRaceUrl));
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

import $ from 'jquery';
$('.scores__time').each(function() {
  let rawTime = $(this).text();
  rawTime = parseFloat(rawTime) * 1000;
  $(this).text(moment.utc(rawTime).format('mm:ss.SSS'));
});
