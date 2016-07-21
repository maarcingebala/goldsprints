import _ from 'lodash';
import { INITIALIZE, START_RACE, STOP_RACE, RESET_RACE,
  UPDATE_POSITION, PLAYER_FINISHED, PLAYER_A, PLAYER_B
} from './actions';

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
  saveRaceUrl: ''
};


function race(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE:
      return _.assign({}, state, {
        playerOne: action.playerOne,
        playerTwo: action.playerTwo,
        distance: action.distance,
        saveRaceUrl: action.saveRaceUrl
      });
    case START_RACE:
      return _.assign({}, state, {
        raceIsActive: true
      });
    case STOP_RACE:
      return _.assign({}, state, {
        raceIsActive: false
      });
    case RESET_RACE:
      return _.assign({}, state, {
        distance: 0,
        positionA: 0,
        positionB: 0,
        speedA: 0,
        speedB: 0,
        finishedA: 0,
        finishedB: 0,
        raceTime: 0,
        raceIsActive: false
      });
    case UPDATE_POSITION:
      if (action.player == PLAYER_A) {
        return _.assign({}, state, {
          positionA: action.position,
          speedA: action.speed,
          raceTime: action.raceTime
        });
      } else if (action.player == PLAYER_B) {
        return _.assign({}, state, {
          positionB: action.position,
          speedB: action.speed,
          raceTime: action.raceTime
        });
      }
    case PLAYER_FINISHED:
      if (action.player == PLAYER_A) {
        return _.assign({}, state, {
          finishedA: action.raceTime
        });
      } else if (action.player == PLAYER_B) {
        return _.assign({}, state, {
          finishedB: action.raceTime
        });
      }
    default:
      return state;
  }
}

export default race;
