import React from 'react';

import soundHigh from '../../sounds/countdown_high.mp3';
import soundLow from '../../sounds/countdown_low.mp3';

const COUNTDOWN_FROM = 5;

class Countdown extends React.Component {

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
    this.lowTickSound = new Audio(soundLow);
    this.highTickSound = new Audio(soundHigh);
  }

  render() {
    return (
      <div className={this.state.active ? 'countdown show' : 'countdown hide'}>
        <span>{this.state.counter}</span>
      </div>
    )
  }
}

Countdown.propTypes = { onCountdownOver: React.PropTypes.func.isRequired };

export default Countdown;
