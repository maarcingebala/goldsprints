import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { startRace, updatePosition, stopRace,
  playerFinished, saveRaceResults,
  PLAYER_A, PLAYER_B, COLOR_A, COLOR_B } from './../actions';
import RaceCanvas from './canvas';
import RaceHeader from './header';
import PlayerStats from './playerStats';
import Countdown from './countdown';
import WSHandler from './../wshandler';


class App extends React.Component {

  constructor(props) {
    super(props);
  }

  onWebsocketMessage(data) {
    if (this.props.raceIsActive) {
      let speedA = parseFloat(data.speed_a);
      let speedB = parseFloat(data.speed_b);
      let interval = parseFloat(data.interval);
      let newPositionA = this.props.positionA + speedA * interval;
      let newPositionB = this.props.positionB + speedB * interval;

      newPositionA = Math.round(newPositionA * 1000) / 1000;
      newPositionB = Math.round(newPositionB * 1000) / 1000;

      let raceTime = this.props.raceTime + interval;

      let finishedA = this.checkPlayerFinished(PLAYER_A, newPositionA, raceTime);
      let finishedB = this.checkPlayerFinished(PLAYER_B, newPositionB, raceTime);

      if (finishedA && finishedB) {
        console.log(`Race ended in ${raceTime} s`);
        this.props.onStopRace();
      } else {
        // TODO: Race time should be updated in separate action.
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
    if ((player == PLAYER_A && this.props.finishedA > 0) ||
        (player == PLAYER_B && this.props.finishedB > 0)) {
      return true;
    }
    if (position >= this.props.distance) {
      console.log(`Player ${player} ended in ${raceTime} s`);
      this.props.onPlayerFinished(player, raceTime);
      return true;
    }
    return false;
  }

  isWinnerA() {
    if (this.props.finishedA && this.props.finishedB) {
      if (this.props.finishedA < this.props.finishedB) {
        return true;
      }
    }
    return false;
  }

  isWinnerB() {
    if (this.props.finishedA && this.props.finishedB) {
      if (this.props.finishedB < this.props.finishedA) {
        return true;
      }
    }
    return false;
  }

  startCountdown() {
    if (!this.props.raceIsActive && !this.refs.countdownComponent.isActive()) {
      this.refs.countdownComponent.start();
    }
  }

  onCountdownOver() {
    this.props.onStart();
  }

  componentWillMount() {
    this.wsHandler = new WSHandler((data) => {this.onWebsocketMessage(data)});
  }

  render() {
    return (
      <div className="">
        <div className="row">
          <RaceHeader
            raceTime={this.props.raceTime}
            playerOne={this.props.playerOne}
            playerTwo={this.props.playerTwo} />
          <Countdown
            onCountdownOver={() => this.onCountdownOver()}
            ref="countdownComponent" />
          <RaceCanvas
            positionA={this.props.positionA}
            positionB={this.props.positionB}
            distance={this.props.distance} />
        </div>
        <div className="row">
          <div className="col-xs-6">
            <PlayerStats
              player={this.props.playerOne}
              position={this.props.positionA}
              raceTime={this.props.finishedA}
              isWinner={this.isWinnerA()}
              color={COLOR_A} />
          </div>
          <div className="col-xs-6">
            <PlayerStats
              player={this.props.playerTwo}
              position={this.props.positionB}
              raceTime={this.props.finishedB}
              isWinner={this.isWinnerB()}
              color={COLOR_B} />
          </div>
        </div>
        <div className="row">
          <button className="btn btn-link with-shadow"
            onClick={() => this.startCountdown()}>Start</button>
        </div>
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
