import axios from 'axios';

export const PLAYER_A = 'PLAYER_A'
export const PLAYER_B = 'PLAYER_B'

export const COLOR_A = 'red';
export const COLOR_B = 'blue';

export const INITIALIZE = 'INITIALIZE';
export const START_RACE = 'START_RACE';
export const STOP_RACE = 'STOP_RACE';
export const RESET_RACE = 'RESET_RACE';
export const UPDATE_POSITION = 'UPDATE_POSITION';
export const PLAYER_FINISHED = 'PLAYER_FINISHED';

export function initialize(playerOne, playerTwo, distance, saveRaceUrl) {
  return {type: INITIALIZE, playerOne, playerTwo, distance, saveRaceUrl}
}

export function startRace() {
  return {type: START_RACE}
}

export function stopRace() {
  return {type: STOP_RACE}
}

export function resetRace() {
  return {type: RESET_RACE}
}

export function updatePosition(player, position, speed, raceTime) {
  return {type: UPDATE_POSITION, player, position, speed, raceTime}
}

export function playerFinished(player, raceTime) {
  return {type: PLAYER_FINISHED, player, raceTime}
}

export function saveRaceResults() {
  return function (dispatch, getState) {
    let state = getState();
    return axios.post(state.saveRaceUrl, {
      player_a: state.finishedA,
      player_b: state.finishedB
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
