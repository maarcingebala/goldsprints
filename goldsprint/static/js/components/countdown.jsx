var React = require('react');

const COUNTDOWN_INTERVAL = 1000;
const COUNTDOWN_FROM = 3;


export const Countdown = React.createClass({

  propTypes: {
    onCountdownOver: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      counter: ''
    }
  },

  start: function() {
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
  },

  render: function() {
    return (
      <div>{this.state.counter}</div>
    )
  }
});
