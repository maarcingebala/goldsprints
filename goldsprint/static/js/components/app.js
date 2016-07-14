import WSHandler from './../wshandler';
import Canvas from './canvas';
import Countdown from './countdown';
import Stats from './stats';
import { startRace, updatePosition, stopRace } from './../actions';

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleNewData = this.handleNewData.bind(this);
    //this.startCountdown = this.startCountdown.bind(this);
  }

  handleNewData(data) {
    if (this.props.raceIsActive) {
      var speedMs = parseFloat(data.speedMs);
      var interval = parseFloat(data.interval);
      var newPosition = this.props.position + speedMs * interval;
      var raceTime = this.props.raceTime + interval;

      this.props.onUpdatePosition(newPosition, speedMs, raceTime);

      if (newPosition >= this.props.distance) {
        console.log(`Race ended in ${raceTime} s`);
        this.props.onStopRace();
      }
    }
  }

  componentWillMount() {
    this.wsHandler = new WSHandler(this.handleNewData);
  }

  render() {
    return (
      <div>
        <Canvas position={this.props.position} distance={this.props.distance} />
        <Stats position={this.props.position} speed={this.props.speedMs} raceTime={this.props.raceTime} />
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
    onUpdatePosition: (position, speedMs, raceTime) => {
      dispatch(updatePosition(position, speedMs, raceTime))
    },
    onStopRace: () => {
      dispatch(stopRace())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
