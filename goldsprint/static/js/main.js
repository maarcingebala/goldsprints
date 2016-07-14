import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './components/app';
import Canvas from './components/canvas';
import race from './reducers';
import {initialize} from './actions';


let store = createStore(race, window.devToolsExtension && window.devToolsExtension());

let root = document.getElementById('race-canvas');

let playerOne = root.dataset.playerOne;
let playerTwo = root.dataset.playerTwo;
let distance = parseFloat(root.dataset.distance);

store.dispatch(initialize(playerOne, playerTwo, distance));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  root
);
