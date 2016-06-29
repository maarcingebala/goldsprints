var React = require('react');

export const Stats = React.createClass({

  getDefaultProps: function() {
    return {
      position: 0,
      speed: 0,
      raceTime: 0
    };
  },

  render: function() {
    var speed = this.props.speed * 3.6;
    return (
      <p>position: {this.props.position.toFixed(2)} m,
        speed: {speed.toFixed(2)} km/h,
        raceTime: {this.props.raceTime.toFixed(2)} s</p>
    );
  }

});