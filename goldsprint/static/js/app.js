import WSHandler from './wshandler';
import Canvas from './components/canvas';
import Countdown from './components/countdown';
import Stats from './components/stats';

var React = require('react');
var ReactDOM = require('react-dom');

const DISTANCE = 250;


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      speedMs: 0,
      readWs: false,
      raceTime: 0
    }
    this.handleNewData = this.handleNewData.bind(this);
    this.startNewRace = this.startNewRace.bind(this);
    this.resetState = this.resetState.bind(this);
    this.stopReceiving = this.stopReceiving.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
  }

  resetState() {
    this.setState({
      position: 0,
      speedMs: 0,
      raceTime: 0
    });
  }

  startReceiving() {
    this.setState({
      readWs: true
    });
  }

  stopReceiving() {
    this.setState({
      readWs: false
    });
  }

  handleNewData(data) {
    if (this.state.readWs) {
      if (this.raceIsActive) {
        var speedMs = parseFloat(data.speedMs);
        var interval = parseFloat(data.interval);
        var newPosition = this.state.position + speedMs * interval;
        var raceTime = this.state.raceTime + interval;

        this.setState({
          position: newPosition,
          speedMs: speedMs,
          raceTime: raceTime
        });

        if (newPosition >= DISTANCE) {
          this.raceIsActive = false;
          this.stopReceiving();
          console.log(`Race ended in ${raceTime} s`);
        }
      }
    }
  }

  startNewRace() {
    this.resetState();
    this.raceIsActive = true;
    this.raceTime = 0;
    this.startReceiving();
  }

  startCountdown() {
    this.refs.countdown.start()
  }

  componentWillMount() {
    this.wsHandler = new WSHandler(this.handleNewData);
  }

  render() {
    var speeedKmh = this.state.speedMs * 3.6;
    return (
      <div>
        <Countdown onCountdownOver={this.startNewRace} ref='countdown'/>
        <Canvas position={this.state.position} distance={DISTANCE} />
        <Stats position={this.state.position} speed={this.state.speedMs} raceTime={this.state.raceTime} />
        <button onClick={this.resetState}>Reset state</button>
        <button onClick={this.stopReceiving}>Stop WS</button>
        <button onClick={this.startCountdown}>New race</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('gameContainer'));
