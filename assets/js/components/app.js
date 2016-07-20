import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { startRace, updatePosition, stopRace } from './../actions';
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

      if (newPositionA >= this.props.distance || newPositionB >= this.props.distance) {
        console.log(`Race ended in ${raceTime} s`);
        this.props.onStopRace();
      } else {
        var raceTime = this.props.raceTime + interval;
        this.props.onUpdatePosition(newPositionA, speedA, newPositionB, speedB, raceTime);
      }
    }
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
    onUpdatePosition: (positionA, speedA, positionB, speedB, raceTime) => {
      dispatch(updatePosition(positionA, speedA, positionB, speedB, raceTime))
    },
    onStopRace: () => {
      dispatch(stopRace())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
