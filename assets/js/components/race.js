import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import {startRace, updatePosition, stopRace, playerFinished, saveRaceResults,
  resetRace} from '../actions';
import {PLAYER_A, PLAYER_B, COLOR_A, COLOR_B} from '../actions/types';
import Countdown from './countdown';
import RaceCanvas from './canvas';
import RaceHeader from './header';
import PlayerStats from './playerStats';
import Winner from './winner';
import { WSHandler, parseWsData } from './../wshandler';


class Race extends React.Component {

  constructor(props) {
    super(props);
  }

  onWebsocketMessage(data) {
    if (this.props.raceIsActive) {
      let parsedData = parseWsData(this.props, data);
      let finishedA = this.checkPlayerFinished(PLAYER_A, parsedData.newPositionA, parsedData.raceTime);
      let finishedB = this.checkPlayerFinished(PLAYER_B, parsedData.newPositionB, parsedData.raceTime);

      if (finishedA && finishedB) {
        console.log(`Race ended in ${parsedData.raceTime} s`);
        this.props.onStopRace();
      } else {
        // TODO: Race time should be updated in separate action.
        if (!finishedA) {
          this.props.onUpdatePosition(PLAYER_A, parsedData.newPositionA, parsedData.speedA, parsedData.raceTime);
        }
        if (!finishedB) {
          this.props.onUpdatePosition(PLAYER_B, parsedData.newPositionB, parsedData.speedB, parsedData.raceTime);
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

  startCountdown() {
    if (!this.props.raceIsActive && !this.refs.countdownComponent.isActive()) {
      this.refs.countdownComponent.start();
    }
  }

  resetRace() {
    this.props.onResetRace();
  }

  getWinner() {
    const { finishedA, finishedB, playerOne, playerTwo } = this.props;
    if (finishedA < finishedB) {
      return playerOne;
    } else if (finishedA > finishedB) {
      return playerTwo;
    } else {
      return null;
    }
  }

  onCountdownOver() {
    this.props.onStart();
  }

  componentWillMount() {
    this.wsHandler = new WSHandler((data) => {this.onWebsocketMessage(data)});
  }

  render() {
    const { prevRaceUrl, nextRaceUrl, finishedA, finishedB } = this.props;
    const canShowWinner = finishedA && finishedB;
    return (
      <div className="">
        <div className="row">
          <RaceHeader
            showRaceTime={true}
            raceTime={this.props.raceTime}
            playerOne={this.props.playerOne}
            playerTwo={this.props.playerTwo} />
          {canShowWinner ? (<Winner winner={this.getWinner()} />) : (null)}
          <Countdown
            onCountdownOver={() => this.onCountdownOver()}
            ref="countdownComponent" />
          <RaceCanvas
            positionA={this.props.positionA}
            positionB={this.props.positionB}
            distance={this.props.distance} />
        </div>
        <div className="row">
          <div className="col-xs-12">
            <PlayerStats
              className="pull-left"
              player={this.props.playerOne}
              position={this.props.positionA}
              speed={this.props.speedA}
              raceTime={this.props.finishedA}
              color={COLOR_A} />
            <PlayerStats
              className="pull-right"
              player={this.props.playerTwo}
              position={this.props.positionB}
              speed={this.props.speedB}
              raceTime={this.props.finishedB}
              color={COLOR_B} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 game-menu">
            {prevRaceUrl ? (<a className="btn btn-link with-shadow pull-left" href={prevRaceUrl}>Previous</a>) : (null)}
            <button className="btn btn-link with-shadow" onClick={() => this.startCountdown()}>Start</button>
            <button className="btn btn-link with-shadow" onClick={() => this.resetRace()}>Reset</button>
            {nextRaceUrl ? (<a className="btn btn-link with-shadow pull-right" href={nextRaceUrl}>Next</a>) : (null)}
          </div>
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
    },
    onResetRace: () => {
      dispatch(resetRace())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Race);
