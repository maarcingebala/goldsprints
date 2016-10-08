import * as T from './types';
import axios from 'axios';

export function initializeRace(playerOne, playerTwo, distance, saveRaceUrl, nextRaceUrl, prevRaceUrl) {
  return {type: T.INITIALIZE_RACE, playerOne, playerTwo, distance, saveRaceUrl, nextRaceUrl, prevRaceUrl}
}

export function initializeFreeRide(playerOne, playerTwo, distance) {
  return {type: T.INITIALIZE_FREE_RIDE, playerOne, playerTwo, distance}
}

export function startRace() {
  return {type: T.START_RACE}
}

export function stopRace() {
  return {type: T.STOP_RACE}
}

export function resetRace() {
  return {type: T.RESET_RACE}
}

export function updatePosition(player, position, speed) {
  return {type: T.UPDATE_POSITION, player, position, speed}
}

export function playerFinished(player, raceTime) {
  return {type: T.PLAYER_FINISHED, player, raceTime}
}

export function updateTime(time) {
  return { type: T.UPDATE_TIME, raceTime: time }
}

export function saveRaceResults() {
  return function (dispatch, getState) {
    const state = getState();
    return axios.post(state.saveRaceUrl, {
      player_a: state.finishedA,
      player_b: state.finishedB
    })
    .catch(function (error) {
      console.error(error);
    });
  }
}
