import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { WSHandler, parseWsData } from './../wshandler';
import { startRace, updatePosition, stopRace, playerFinished, saveRaceResults, resetRace, updateTime } from '../actions';
import { PLAYER_A, PLAYER_B, COLOR_A, COLOR_B } from '../actions/types';
import Timer from '../timer';
import Countdown from './countdown';
import RaceCanvas from './canvas';
import RaceHeader from './header';
import PlayerStats from './playerStats';
import Winner from './winner';


class Race extends React.Component {

  componentWillMount() {
    this.wsHandler = new WSHandler(data => this.onWebsocketMessage(data));
    this.timer = new Timer();
  }

  onWebsocketMessage(data) {
    const { raceIsActive, positionA, positionB } = this.props;

    if (raceIsActive) {
      const { deltaA, deltaB, speedA, speedB } = parseWsData(data);

      // calculate current race time and players' positions
      const raceTime = this.timer.getTime();
      const newPositionA = positionA + deltaA;
      const newPositionB = positionB + deltaB;

      // check if any player has finished the race
      const finishedA = this.checkPlayerFinished(PLAYER_A, newPositionA, raceTime);
      const finishedB = this.checkPlayerFinished(PLAYER_B, newPositionB, raceTime);

      // update time
      this.props.dispatchUpdateTime(raceTime);

      // update players' positions 
      if (!finishedA) {
        this.props.dispatchUpdatePosition(PLAYER_A, newPositionA, speedA);
      }
      if (!finishedB) {
        this.props.dispatchUpdatePosition(PLAYER_B, newPositionB, speedB);
      }

      // stop the race if both players finished
      if (finishedA && finishedB) {
        this.props.dispatchStopRace();
      }
    }
  }

  checkPlayerFinished(player, position, raceTime) {
    const { finishedA, finishedB, distance } = this.props;
    if ((player == PLAYER_A && finishedA > 0) || (player == PLAYER_B && finishedB > 0)) {
      return true;
    }
    if (position >= distance) {
      console.log(`Player ${player} ended in ${raceTime} s`);
      this.props.dispatchPlayerFinished(player, raceTime);
      return true;
    }
    return false;
  }

  startRace() {
    this.timer.start();
    this.props.dispatchStart();
    // this.startCountdown();
  }

  startCountdown() {
    if (!this.props.raceIsActive && !this.refs.countdownComponent.isActive()) {
      this.refs.countdownComponent.start();
    }
  }

  resetRace() {
    this.timer.reset();
    this.props.dispatchResetRace();
  }

  getWinner() {
    const { finishedA, finishedB, playerOne, playerTwo } = this.props;
    if (finishedA < finishedB) {
      return { name: playerOne, color: COLOR_A, time: finishedA };
    } else if (finishedA > finishedB) {
      return { name: playerTwo, color: COLOR_B, time: finishedB };
    } else {
      return { name: null, time: finishedA, color: null };
    }
  }

  onCountdownOver() {
    this.props.onStart();
  }

  render() {
    const { distance, raceTime, finishedA, finishedB, playerOne, playerTwo, positionA, positionB, prevRaceUrl, nextRaceUrl, speedA, speedB } = this.props;
    const raceFinished = finishedA && finishedB;
    return (
      <div>
        <div className="row">
          <RaceHeader
            showRaceTime={true}
            raceTime={raceTime}
            playerOne={playerOne}
            playerTwo={playerTwo} />
          
          {raceFinished ? (<Winner winner={this.getWinner()} />) : (null)}
          
          <Countdown onCountdownOver={() => this.onCountdownOver()} ref="countdownComponent" />
          <RaceCanvas positionA={positionA} positionB={positionB} distance={distance} />
        </div>
        <div className="row">
          <div className="col-xs-12 game-menu">
            {prevRaceUrl && (<a className="btn btn-link with-shadow pull-left" href={prevRaceUrl}>Previous</a>)}
            <button className="btn btn-link with-shadow" onClick={() => this.startRace()}>Start</button>
            <button className="btn btn-link with-shadow" onClick={() => this.resetRace()}>Reset</button>
            {nextRaceUrl && (<a className="btn btn-link with-shadow pull-right" href={nextRaceUrl}>Next</a>)}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatchStart: () => {
      dispatch(startRace())
    },
    dispatchUpdatePosition: (player, position, speed) => {
      dispatch(updatePosition(player, position, speed))
    },
    dispatchUpdateTime: (time) => {
      dispatch(updateTime(time));
    },
    dispatchStopRace: () => {
      dispatch(stopRace());
      dispatch(saveRaceResults())
    },
    dispatchPlayerFinished: (player, raceTime) => {
      dispatch(playerFinished(player, raceTime))
    },
    dispatchResetRace: () => {
      dispatch(resetRace())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Race);
