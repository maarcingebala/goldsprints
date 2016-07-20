export const INITIALIZE = 'INITIALIZE';
export const START_RACE = 'START_RACE';
export const STOP_RACE = 'STOP_RACE';
export const RESET_RACE = 'RESET_RACE';
export const UPDATE_POSITION = 'UPDATE_POSITION';

export function initialize(playerOne, playerTwo, distance) {
  return {type: INITIALIZE, playerOne, playerTwo, distance}
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

export function updatePosition(positionA, speedA, positionB, speedB, raceTime) {
  return {type: UPDATE_POSITION, positionA, speedA, positionB, speedB, raceTime}
}
