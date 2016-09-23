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

  onWebsocketMessage(data) {
    const { raceIsActive, positionA, positionB, raceTime } = this.props;
    if (raceIsActive) {
      const parsedData = parseWsData(data, positionA, positionB, raceTime);
      const finishedA = this.checkPlayerFinished(PLAYER_A, parsedData.newPositionA, parsedData.raceTime);
      const finishedB = this.checkPlayerFinished(PLAYER_B, parsedData.newPositionB, parsedData.raceTime);

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
    const { finishedA, finishedB, distance } = this.props;
    if ((player == PLAYER_A && finishedA > 0) || (player == PLAYER_B && finishedB > 0)) {
      return true;
    }
    if (position >= distance) {
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

  componentWillMount() {
    this.wsHandler = new WSHandler(data => this.onWebsocketMessage(data));
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
