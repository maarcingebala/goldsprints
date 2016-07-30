var React = require('react');

const COUNTDOWN_FROM = 5;

const SOUND_LOW = require('file!../../sounds/countdown_low.mp3');
const SOUND_HIGH = require('file!../../sounds/countdown_high.mp3');

class Countdown extends React.Component {

  constructor(props) {
    super(props);
  }

  start() {
    this.setState({counter: COUNTDOWN_FROM, active: true});
    this.lowTickSound.play();
    this.interval = setInterval(this.tick, 1000);
  }

  tick() {
    this.setState({counter: this.state.counter - 1});
    if (this.state.counter > 0) {
      this.lowTickSound.play();
    } else {
      this.setState({active: false})
      this.highTickSound.play();
      this.props.onCountdownOver();
      clearInterval(this.interval);
    }
  }

  isActive() {
    return this.state.active;
  }

  componentWillMount() {
    this.state = { counter: 0, active: false }
    this.tick = this.tick.bind(this);
    this.lowTickSound = new Audio(SOUND_LOW);
    this.highTickSound = new Audio(SOUND_HIGH);
  }

  render() {
    return (
      <div className="countdown">Countdown: {this.state.counter}</div>
    )
  }
}

Countdown.propTypes = { onCountdownOver: React.PropTypes.func.isRequired };

export default Countdown;
