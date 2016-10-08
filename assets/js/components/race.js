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

      const newPositionA = positionA + deltaA;
      const newPositionB = positionB + deltaB;
      const raceTime = this.timer.getTime();

      const finishedA = this.checkPlayerFinished(PLAYER_A, newPositionA, raceTime);
      const finishedB = this.checkPlayerFinished(PLAYER_B, newPositionB, raceTime);

      if (finishedA && finishedB) {
        this.props.dispatchStopRace();
      } else {
        // separate action for updating position and time, now time is updated twice
        if (!finishedA) {
          this.props.dispatchUpdatePosition(PLAYER_A, newPositionA, speedA);
        }
        if (!finishedB) {
          this.props.dispatchUpdatePosition(PLAYER_B, newPositionB, speedB);
        }
        this.props.dispatchUpdateTime(raceTime);
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
      return { name: playerOne, color: COLOR_A };
    } else if (finishedA > finishedB) {
      return { name: playerTwo, color: COLOR_B };
    } else {
      return null;
    }
  }

  onCountdownOver() {
    this.props.onStart();
  }

  render() {
    const {
      distance,
      raceTime,
      finishedA, finishedB,
      playerOne, playerTwo,
      positionA, positionB,
      prevRaceUrl, nextRaceUrl,
      speedA, speedB
    } = this.props;

    const canShowWinner = finishedA && finishedB;

    return (
      <div className="">
        <div className="row">
          <RaceHeader
            showRaceTime={true}
            raceTime={raceTime}
            playerOne={playerOne}
            playerTwo={playerTwo} />
          {canShowWinner ? (<Winner winner={this.getWinner()} />) : (null)}
          <Countdown
            onCountdownOver={() => this.onCountdownOver()}
            ref="countdownComponent" />
          <RaceCanvas
            positionA={positionA}
            positionB={positionB}
            distance={distance} />
        </div>
        <div className="row">
          <div className="col-xs-12">
            <PlayerStats
              className="pull-left"
              player={playerOne}
              position={positionA}
              speed={speedA}
              raceTime={finishedA}
              color={COLOR_A} />
            <PlayerStats
              className="pull-right"
              player={playerTwo}
              position={positionB}
              speed={speedB}
              raceTime={finishedB}
              color={COLOR_B} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 game-menu">
            {prevRaceUrl ? (<a className="btn btn-link with-shadow pull-left" href={prevRaceUrl}>Previous</a>) : (null)}
            <button className="btn btn-link with-shadow" onClick={() => this.startRace()}>Start</button>
            <button className="btn btn-link with-shadow" onClick={() => this.resetRace()}>Reset</button>
            {nextRaceUrl ? (<a className="btn btn-link with-shadow pull-right" href={nextRaceUrl}>Next</a>) : (null)}
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
