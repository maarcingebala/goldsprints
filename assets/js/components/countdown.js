var React = require('react');

const COUNTDOWN_INTERVAL = 1000;
const COUNTDOWN_FROM = 3;


class Countdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      counter: ''
    }
  }

  start() {
    var counter = COUNTDOWN_FROM;
    var intervalId = setInterval(function() {
      if (counter > 0) {
        this.setState({counter: counter});
        counter -= 1;
      } else {
        this.setState({counter: 'Start!'});
        this.props.onCountdownOver();
        clearInterval(intervalId);
      }
    }.bind(this), COUNTDOWN_INTERVAL);
  }

  render() {
    return (
      <div>{this.state.counter}</div>
    )
  }
}

Countdown.propTypes = { onCountdownOver: React.PropTypes.func.isRequired };

export default Countdown;
