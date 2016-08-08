import React from 'react';
import { connect } from 'react-redux';

import { updatePosition } from '../actions';
import {PLAYER_A, PLAYER_B, COLOR_A, COLOR_B} from '../actions/types';
import RaceCanvas from './canvas';
import RaceHeader from './header';
import PlayerStats from './playerStats';
import { WSHandler, parseWsData } from './../wshandler';


class FreeRide extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.wsHandler = new WSHandler((data) => {this.onWebsocketMessage(data)});
  }

  onWebsocketMessage(data) {
    let parsedData = parseWsData(this.props, data);
    this.props.onUpdatePosition(PLAYER_A, parsedData.newPositionA, parsedData.speedA, parsedData.raceTime);
    this.props.onUpdatePosition(PLAYER_B, parsedData.newPositionB, parsedData.speedB, parsedData.raceTime);
  }

  render() {
    return (
      <div className="">
        <div className="row">
          <RaceHeader
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
    onUpdatePosition: (player, position, speed, raceTime) => {
      dispatch(updatePosition(player, position, speed, raceTime))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FreeRide);
