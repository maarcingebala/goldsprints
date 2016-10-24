import React from 'react';
import { connect } from 'react-redux';

import { updatePosition } from '../actions';
import {PLAYER_A, PLAYER_B, COLOR_A, COLOR_B} from '../actions/types';
import RaceCanvas from './canvas';
import RaceHeader from './header';
import PlayerStats from './playerStats';
import { WSHandler, parseWsData } from './../wshandler';


class FreeRide extends React.Component {

  componentWillMount() {
    this.wsHandler = new WSHandler((data) => {this.onWebsocketMessage(data)});
  }

  onWebsocketMessage(data) {
    const { positionA, positionB } = this.props;
    const { deltaA, deltaB, speedA, speedB } = parseWsData(data);

    const newPositionA = positionA + deltaA;
    const newPositionB = positionB + deltaB;

    this.props.dispatchUpdatePosition(PLAYER_A, newPositionA, speedA);
    this.props.dispatchUpdatePosition(PLAYER_B, newPositionB, speedB);
  }

  render() {
    return (
      <div className="">
        <div className="row">
          <RaceHeader
            showRaceTime={false}
            playerOne={this.props.playerOne}
            playerTwo={this.props.playerTwo} />
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
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return state
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatchUpdatePosition: (player, position, speed) => {
      dispatch(updatePosition(player, position, speed))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FreeRide);
