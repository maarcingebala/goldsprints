import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { startRace, updatePosition, stopRace, playerFinished, saveRaceResults, PLAYER_A, PLAYER_B, } from './../actions';
import RaceCanvas from './canvas';
import RaceHeader from './header';
import Countdown from './countdown';
import Stats from './stats';
import WSHandler from './../wshandler';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleNewData = this.handleNewData.bind(this);
    //this.startCountdown = this.startCountdown.bind(this);
  }

  handleNewData(data) {
    if (this.props.raceIsActive) {
      let speedA = parseFloat(data.speed_a);
      let speedB = parseFloat(data.speed_b);
      let interval = parseFloat(data.interval);
      let newPositionA = this.props.positionA + speedA * interval;
      let newPositionB = this.props.positionB + speedB * interval;

      let raceTime = this.props.raceTime + interval;

      let finishedA = this.checkPlayerFinished(PLAYER_A, newPositionA, raceTime);
      let finishedB = this.checkPlayerFinished(PLAYER_B, newPositionB, raceTime);

      if (finishedA && finishedB) {
        console.log(`Race ended in ${raceTime} s`);
        this.props.onStopRace();
      } else {
        if (!finishedA) {
          this.props.onUpdatePosition(PLAYER_A, newPositionA, speedA, raceTime);
        }
        if (!finishedB) {
          this.props.onUpdatePosition(PLAYER_B, newPositionB, speedB, raceTime);
        }
      }
    }
  }

  checkPlayerFinished(player, position, raceTime) {
    if ((player == PLAYER_A && this.props.finishedA > 0) || (player == PLAYER_B && this.props.finishedB > 0)) {
      return true;
    }
    if (position >= this.props.distance) {
      console.log(`Player ${player} ended in ${raceTime} s`);
      this.props.onPlayerFinished(player, raceTime);
      return true;
    }
    return false;
  }

  componentWillMount() {
    this.wsHandler = new WSHandler(this.handleNewData);
  }

  render() {
    return (
      <div className="race">
        <RaceHeader raceTime={this.props.raceTime} playerOne={this.props.playerOne} playerTwo={this.props.playerTwo} />
        <RaceCanvas positionA={this.props.positionA} positionB={this.props.positionB} distance={this.props.distance} />
        <button onClick={() => this.props.onStart()}>Start</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onStart: () => {
      dispatch(startRace())
    },
    onUpdatePosition: (player, position, speed, raceTime) => {
      dispatch(updatePosition(player, position, speed, raceTime))
    },
    onStopRace: () => {
      dispatch(stopRace());
      dispatch(saveRaceResults())
    },
    onPlayerFinished: (player, raceTime) => {
      dispatch(playerFinished(player, raceTime))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
