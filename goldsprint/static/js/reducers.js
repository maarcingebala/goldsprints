import _ from 'lodash';
import { INITIALIZE, START_RACE, STOP_RACE, RESET_RACE, UPDATE_POSITION } from './actions';

const initialState = {
  playerOne: '',
  playerTwo: '',
  distance: 0,
  position: 0,
  speedMs: 0,
  raceTime: 0,
  raceIsActive: false
};


function race(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE:
      return _.assign({}, state, {
        playerOne: action.playerOne,
        playerTwo: action.playerTwo,
        distance: action.distance
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
        position: 0,
        speedMs: 0,
        raceTime: 0,
        raceIsActive: false
      });
    case UPDATE_POSITION:
      return _.assign({}, state, {
        position: action.position,
        speedMs: action.speedMs,
        raceTime: action.raceTime
      });
    default:
      return state;
  }
}

export default race;
