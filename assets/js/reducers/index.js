import _ from 'lodash';
import * as T from '../actions/types';

const initialState = {
  playerOne: '',
  playerTwo: '',
  distance: 0,
  positionA: 0,
  positionB: 0,
  speedA: 0,
  speedB: 0,
  finishedA: 0,
  finishedB: 0,
  raceTime: 0,
  raceIsActive: false,
  saveRaceUrl: '',
  nextRaceUrl: '',
  prevRaceUrl: '',
  mode: ''
};


function game(state = initialState, action) {
  switch (action.type) {
    case T.INITIALIZE_RACE:
      return _.assign({}, state, {
        playerOne: action.playerOne,
        playerTwo: action.playerTwo,
        distance: action.distance,
        saveRaceUrl: action.saveRaceUrl,
        nextRaceUrl: action.nextRaceUrl,
        prevRaceUrl: action.prevRaceUrl,
        mode: T.MODE_RACE
      });
    case T.INITIALIZE_FREE_RIDE:
      return _.assign({}, state, {
        playerOne: action.playerOne,
        playerTwo: action.playerTwo,
        distance: action.distance,
        mode: T.MODE_FREE_RIDE
      });
    case T.START_RACE:
      return _.assign({}, state, {
        raceIsActive: true
      });
    case T.STOP_RACE:
      return _.assign({}, state, {
        raceIsActive: false
      });
    case T.RESET_RACE:
      return _.assign({}, state, {
        positionA: 0,
        positionB: 0,
        speedA: 0,
        speedB: 0,
        finishedA: 0,
        finishedB: 0,
        raceTime: 0,
        raceIsActive: false
      });
    case T.UPDATE_POSITION:
      if (action.player == T.PLAYER_A) {
        return _.assign({}, state, {
          positionA: action.position,
          speedA: action.speed,
          raceTime: action.raceTime
        });
      } else if (action.player == T.PLAYER_B) {
        return _.assign({}, state, {
          positionB: action.position,
          speedB: action.speed,
          raceTime: action.raceTime
        });
      }
    case T.PLAYER_FINISHED:
      if (action.player == T.PLAYER_A) {
        return _.assign({}, state, {
          finishedA: action.raceTime
        });
      } else if (action.player == T.PLAYER_B) {
        return _.assign({}, state, {
          finishedB: action.raceTime
        });
      }
    default:
      return state;
  }
}

export default game;
